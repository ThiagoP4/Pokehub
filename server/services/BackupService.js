import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SAMPLE_BACKUPS_DIR = path.resolve(__dirname, '../sample-world/backups')

export class BackupService {
  constructor(options = {}) {
    this.serverPath = options.serverPath || process.env.MINECRAFT_SERVER_PATH || path.resolve(__dirname, '../sample-world')
    this.customBackupsPath = options.backupsPath || process.env.BACKUPS_PATH || null
  }

  get candidateDirs() {
    const list = []
    if (this.customBackupsPath) {
      list.push(this.customBackupsPath)
    }
    list.push(this.serverPath)
    list.push(path.join(this.serverPath, 'backups'))
    list.push(path.join(this.serverPath, 'simplebackups'))
    list.push(SAMPLE_BACKUPS_DIR)
    return list
  }

  formatBytes(bytes) {
    if (!bytes || bytes <= 0) return '0 B'
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  async computeDirectorySize(dirPath) {
    let total = 0
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        if (entry.isDirectory()) {
          total += await this.computeDirectorySize(fullPath)
        } else if (entry.isFile()) {
          const st = await fs.stat(fullPath)
          total += st.size
        }
      }
    } catch {
      // ignora pastas sem permissão
    }
    return total
  }

  async getBackups() {
    const backups = []

    // 1. Verifica pasta world_backup real no servidor
    const worldBackupDir = path.join(this.serverPath, 'world_backup')
    try {
      const stat = await fs.stat(worldBackupDir)
      if (stat.isDirectory()) {
        const sizeBytes = await this.computeDirectorySize(worldBackupDir)
        backups.push({
          id: 'world_backup',
          filename: 'world_backup',
          displayName: 'Snapshot do Mundo (world_backup)',
          type: 'directory',
          sizeBytes,
          sizeFormatted: this.formatBytes(sizeBytes),
          createdAt: stat.mtime.toISOString(),
          version: 'Minecraft 1.21.1 • Cobblemon 1.6',
          status: 'ready',
          notes: 'Cópia física da pasta world_backup no servidor'
        })
      }
    } catch {
      // world_backup não encontrado
    }

    // 2. Escaneia arquivos de backup reais (.zip, .tar.gz, .tgz, .tar, .7z)
    const seenFiles = new Set()
    for (const dir of this.candidateDirs) {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true })
        for (const entry of entries) {
          if (entry.isFile() && /\.(zip|tar\.gz|tgz|tar|7z)$/i.test(entry.name)) {
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
              notes: 'Arquivo compactado no servidor',
              filePath: fullPath
            })
          }
        }
      } catch {
        // Ignora diretórios inexistentes
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
