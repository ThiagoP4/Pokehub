import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import { parseNbtBuffer } from '../utils/nbtParser.js'

const execFileAsync = promisify(execFile)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DEFAULT_JAIL_MOUNT_PATH = '/mnt/minecraft_server'
const DEFAULT_SAMPLE_PATH = path.resolve(__dirname, '../sample-world')

// Raio de regiões ao redor do Spawn (3 regiões para cada lado = 7x7 = 3.584 x 3.584 blocos)
const SPAWN_REGION_RADIUS = 3

export class BackupService {
  constructor(options = {}) {
    const autoDetectedPath = fsSync.existsSync(DEFAULT_JAIL_MOUNT_PATH)
      ? DEFAULT_JAIL_MOUNT_PATH
      : DEFAULT_SAMPLE_PATH
    this.serverPath = options.serverPath || process.env.MINECRAFT_SERVER_PATH || autoDetectedPath
    this.customBackupsPath = options.backupsPath || process.env.BACKUPS_PATH || '/mnt/backups'
    this.sizeCache = new Map()
  }

  get candidateDirs() {
    return [
      this.customBackupsPath,
      this.serverPath,
      path.join(this.serverPath, 'backups'),
      path.join(this.serverPath, 'simplebackups')
    ].filter(Boolean)
  }

  formatBytes(bytes) {
    if (!bytes || bytes <= 0) return '0 B'
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  async getFastDirectorySize(dirPath) {
    const cached = this.sizeCache.get(dirPath)
    if (cached && Date.now() - cached.time < 5 * 60 * 1000) {
      return cached.bytes
    }

    try {
      const { stdout } = await execFileAsync('du', ['-sk', dirPath], { timeout: 3000 })
      const kb = parseInt(stdout.trim().split(/\s+/)[0], 10)
      if (!Number.isNaN(kb)) {
        const bytes = kb * 1024
        this.sizeCache.set(dirPath, { bytes, time: Date.now() })
        return bytes
      }
    } catch {
      // Fallback caso du não esteja disponível
    }

    return 0
  }

  /**
   * Lê as coordenadas exatas do Spawn a partir do world/level.dat
   */
  async getSpawnCoordinates() {
    const levelDatPath = path.join(this.serverPath, 'world', 'level.dat')
    try {
      const buf = await fs.readFile(levelDatPath)
      const parsed = parseNbtBuffer(buf)
      const data = parsed?.Data || parsed || {}
      const spawnX = Number(data.SpawnX ?? 0)
      const spawnY = Number(data.SpawnY ?? 64)
      const spawnZ = Number(data.SpawnZ ?? 0)
      return { spawnX, spawnY, spawnZ }
    } catch {
      return { spawnX: 0, spawnY: 64, spawnZ: 0 }
    }
  }

  /**
   * Monta a lista de arquivos e pastas do Mundo contendo APENAS a região do Spawn (~3.500x3.500 blocos)
   * + todos os dados essenciais de jogadores, Pokémons, PC, Pokédex e level.dat
   */
  async buildSpawnBackupManifest(radius = SPAWN_REGION_RADIUS) {
    const worldDir = path.join(this.serverPath, 'world')
    const { spawnX, spawnZ } = await this.getSpawnCoordinates()
    const centerRx = Math.floor(spawnX / 512)
    const centerRz = Math.floor(spawnZ / 512)

    const relativePaths = []
    let totalBytes = 0

    // 1. Arquivos e pastas essenciais do mundo e do Cobblemon
    const essentialEntries = [
      'level.dat',
      'level.dat_old',
      'data',
      'datapacks',
      'serverconfig',
      'playerdata',
      'advancements',
      'stats',
      'pokemon',
      'pokedex',
      'cobblemonplayerdata',
      'cobbledollarsplayerdata',
      'cobblenav'
    ]

    for (const item of essentialEntries) {
      const fullPath = path.join(worldDir, item)
      try {
        const st = await fs.stat(fullPath)
        relativePaths.push(path.posix.join('world', item))
        if (st.isFile()) {
          totalBytes += st.size
        } else if (st.isDirectory()) {
          totalBytes += await this.getFastDirectorySize(fullPath)
        }
      } catch {
        // item opcional não existe
      }
    }

    // 2. Filtra apenas os arquivos .mca ao redor do Spawn nas pastas region, entities e poi
    const mcaFolders = ['region', 'entities', 'poi']
    let matchedRegionFiles = 0

    for (const folder of mcaFolders) {
      const folderPath = path.join(worldDir, folder)
      try {
        const files = await fs.readdir(folderPath)
        for (const file of files) {
          const match = file.match(/^r\.(-?\d+)\.(-?\d+)\.mca$/)
          if (!match) continue
          const rx = parseInt(match[1], 10)
          const rz = parseInt(match[2], 10)

          if (Math.abs(rx - centerRx) <= radius && Math.abs(rz - centerRz) <= radius) {
            const fullFile = path.join(folderPath, file)
            const st = await fs.stat(fullFile)
            totalBytes += st.size
            relativePaths.push(path.posix.join('world', folder, file))
            if (folder === 'region') matchedRegionFiles += 1
          }
        }
      } catch {
        // pasta não encontrada
      }
    }

    return {
      spawnX,
      spawnZ,
      centerRx,
      centerRz,
      matchedRegionFiles,
      totalBytes,
      relativePaths
    }
  }

  async getBackups() {
    const backups = []

    const worldDir = path.join(this.serverPath, 'world')
    try {
      const stat = await fs.stat(worldDir)
      if (stat.isDirectory()) {
        // 1. Backup Leve: Apenas Região do Spawn + Dados de Todos os Jogadores e Pokémons
        const spawnManifest = await this.buildSpawnBackupManifest()
        backups.push({
          id: 'world_spawn',
          filename: 'world_spawn_backup.tar.gz',
          displayName: 'Região do Spawn + Todos os Pokémons (Recomendado)',
          type: 'archive',
          sizeBytes: spawnManifest.totalBytes,
          sizeFormatted: spawnManifest.totalBytes > 0 ? this.formatBytes(spawnManifest.totalBytes) : '~150 MB',
          createdAt: stat.mtime.toISOString(),
          version: 'Minecraft 1.21.1 • Cobblemon 1.6',
          status: 'ready',
          notes: `Área de 3.584x3.584 blocos centrada no Spawn (X=${spawnManifest.spawnX}, Z=${spawnManifest.spawnZ}) + Partys, PC e Pokédex`
        })

        // 2. Mundo Completo (world)
        const sizeBytes = await this.getFastDirectorySize(worldDir)
        backups.push({
          id: 'world',
          filename: 'world.tar.gz',
          targetFolder: 'world',
          displayName: 'Mapa Completo (world)',
          type: 'directory',
          sizeBytes,
          sizeFormatted: sizeBytes > 0 ? this.formatBytes(sizeBytes) : 'Compactação sob demanda',
          createdAt: stat.mtime.toISOString(),
          version: 'Minecraft 1.21.1 • Cobblemon 1.6',
          status: 'ready',
          notes: 'Todas as regiões exploradas do mundo ativo'
        })
      }
    } catch {
      // world não encontrado
    }

    // 3. Snapshot world_backup no servidor
    const worldBackupDir = path.join(this.serverPath, 'world_backup')
    try {
      const stat = await fs.stat(worldBackupDir)
      if (stat.isDirectory()) {
        const sizeBytes = await this.getFastDirectorySize(worldBackupDir)
        backups.push({
          id: 'world_backup',
          filename: 'world_backup.tar.gz',
          targetFolder: 'world_backup',
          displayName: 'Backup Antigo (world_backup)',
          type: 'directory',
          sizeBytes,
          sizeFormatted: sizeBytes > 0 ? this.formatBytes(sizeBytes) : 'Compactação sob demanda',
          createdAt: stat.mtime.toISOString(),
          version: 'Minecraft 1.21.1 • Cobblemon 1.6',
          status: 'ready',
          notes: 'Snapshot world_backup armazenado na pasta do servidor'
        })
      }
    } catch {
      // world_backup não encontrado
    }

    // 4. Escaneia arquivos compactados avulsos (.zip, .tar.gz, .tgz, .tar, .7z)
    const seenFiles = new Set()
    for (const dir of this.candidateDirs) {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true })
        for (const entry of entries) {
          if (entry.isFile() && /\.(zip|tar\.gz|tgz|tar|7z|tar\.zst)$/i.test(entry.name)) {
            const fullPath = path.join(dir, entry.name)
            if (seenFiles.has(fullPath)) continue
            seenFiles.add(fullPath)

            const stat = await fs.stat(fullPath)
            backups.push({
              id: entry.name,
              filename: entry.name,
              displayName: entry.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
              type: 'archive',
              sizeBytes: stat.size,
              sizeFormatted: this.formatBytes(stat.size),
              createdAt: stat.mtime.toISOString(),
              version: 'Minecraft 1.21.1 • Cobblemon 1.6',
              status: 'ready',
              notes: `Arquivo em ${dir}`,
              filePath: fullPath
            })
          }
        }
      } catch {
        // Ignora diretórios que não existem
      }
    }

    return backups
  }

  getBackupFilePath(filename) {
    const safeName = path.basename(filename)
    for (const dir of this.candidateDirs) {
      const full = path.join(dir, safeName)
      if (fsSync.existsSync(full) && fsSync.statSync(full).isFile()) {
        return full
      }
    }
    return null
  }
}
