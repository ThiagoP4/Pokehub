import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

const execFileAsync = promisify(execFile)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DEFAULT_JAIL_MOUNT_PATH = '/mnt/minecraft_server'
const DEFAULT_SAMPLE_PATH = path.resolve(__dirname, '../sample-world')

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
      // Fallback caso du não esteja disponível (ex: Windows dev)
    }

    return 0
  }

  async getBackups() {
    const backups = []

    // 1. Mundo atual em tempo real (world)
    const worldDir = path.join(this.serverPath, 'world')
    try {
      const stat = await fs.stat(worldDir)
      if (stat.isDirectory()) {
        const sizeBytes = await this.getFastDirectorySize(worldDir)
        backups.push({
          id: 'world',
          filename: 'world.tar.gz',
          targetFolder: 'world',
          displayName: 'Mapa Atual (world)',
          type: 'directory',
          sizeBytes,
          sizeFormatted: sizeBytes > 0 ? this.formatBytes(sizeBytes) : 'Compactação sob demanda',
          createdAt: stat.mtime.toISOString(),
          version: 'Minecraft 1.21.1 • Cobblemon 1.6',
          status: 'ready',
          notes: 'Gera um arquivo .tar.gz em tempo real do mundo ativo'
        })
      }
    } catch {
      // world não encontrado
    }

    // 2. Snapshot world_backup no servidor
    const worldBackupDir = path.join(this.serverPath, 'world_backup')
    try {
      const stat = await fs.stat(worldBackupDir)
      if (stat.isDirectory()) {
        const sizeBytes = await this.getFastDirectorySize(worldBackupDir)
        backups.push({
          id: 'world_backup',
          filename: 'world_backup.tar.gz',
          targetFolder: 'world_backup',
          displayName: 'Backup Salvo (world_backup)',
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

    // 3. Escaneia arquivos compactados (.zip, .tar.gz, .tgz, .tar, .7z, .zst)
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

    return backups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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
