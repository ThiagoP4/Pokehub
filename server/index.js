import http from 'node:http'
import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { DashboardService } from './services/DashboardService.js'
import { BackupService } from './services/BackupService.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ENV_PATH = path.resolve(__dirname, '../.env')

// Carrega automaticamente o arquivo .env da raiz do projeto, independente do diretório atual
if (fsSync.existsSync(ENV_PATH)) {
  const envContent = fsSync.readFileSync(ENV_PATH, 'utf8')
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '')
      if (!process.env[key]) {
        process.env[key] = val
      }
    }
  }
}

const DIST_PATH = path.resolve(__dirname, '../dist')
const PORT = Number(process.env.PORT) || 3001

const dashboardService = new DashboardService()
const backupService = new BackupService({
  serverPath: dashboardService.fsProvider.serverPath
})

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon'
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  })
  res.end(JSON.stringify(payload))
}

async function serveStaticFile(reqPath, res) {
  try {
    const safePath = reqPath === '/' ? '/index.html' : reqPath
    const filePath = path.join(DIST_PATH, safePath)
    const stat = await fs.stat(filePath)
    if (stat.isFile()) {
      const ext = path.extname(filePath).toLowerCase()
      const content = await fs.readFile(filePath)
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' })
      res.end(content)
      return true
    }
  } catch {
    // Fallback para SPA index.html se dist existir
    try {
      const indexFile = path.join(DIST_PATH, 'index.html')
      const content = await fs.readFile(indexFile)
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(content)
      return true
    } catch {
      return false
    }
  }
  return false
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    })
    res.end()
    return
  }

  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
  const pathname = url.pathname

  try {
    if (pathname === '/api/health' && req.method === 'GET') {
      sendJson(res, 200, {
        status: 'ok',
        provider: dashboardService.activeProviderName,
        serverPath: dashboardService.fsProvider.serverPath,
        worldName: dashboardService.fsProvider.worldName
      })
      return
    }

    if (pathname === '/api/dashboard' && req.method === 'GET') {
      const data = await dashboardService.getDashboardData()
      sendJson(res, 200, data)
      return
    }

    if (pathname === '/api/players' && req.method === 'GET') {
      const data = await dashboardService.getDashboardData()
      sendJson(res, 200, data.playersData)
      return
    }

    if (pathname.startsWith('/api/players/') && req.method === 'GET') {
      const username = decodeURIComponent(pathname.replace('/api/players/', ''))
      const player = await dashboardService.getPlayerByUsername(username)
      if (!player) {
        sendJson(res, 404, { error: 'Jogador não encontrado' })
        return
      }
      sendJson(res, 200, player)
      return
    }

    // Rotas de Backups do Mapa
    if (pathname === '/api/backups' && req.method === 'GET') {
      const list = await backupService.getBackups()
      sendJson(res, 200, list)
      return
    }

    if (pathname.startsWith('/api/backups/download/') && req.method === 'GET') {
      const filename = decodeURIComponent(pathname.replace('/api/backups/download/', ''))

      // 1. Backup inteligente apenas da Região do Spawn + Dados de Jogadores/Pokémons
      if (filename === 'world_spawn' || filename === 'world_spawn_backup.tar.gz') {
        const manifest = await backupService.buildSpawnBackupManifest()
        if (manifest.relativePaths.length > 0) {
          res.writeHead(200, {
            'Content-Type': 'application/gzip',
            'Content-Disposition': 'attachment; filename="world_spawn_backup.tar.gz"'
          })
          const tarProc = spawn('tar', ['-czf', '-', '-C', backupService.serverPath, ...manifest.relativePaths])
          tarProc.stdout.pipe(res)
          req.on('close', () => {
            try { tarProc.kill() } catch {}
          })
          tarProc.on('error', () => res.end())
          return
        }
      }

      // 2. Se for o diretório world completo ou world_backup do servidor, compacta em tempo real via stream tar.gz
      if (filename === 'world' || filename === 'world.tar.gz' || filename === 'world_backup' || filename === 'world_backup.tar.gz') {
        const folderName = filename.startsWith('world_backup') ? 'world_backup' : 'world'
        const targetDir = path.join(backupService.serverPath, folderName)
        if (fsSync.existsSync(targetDir) && fsSync.statSync(targetDir).isDirectory()) {
          res.writeHead(200, {
            'Content-Type': 'application/gzip',
            'Content-Disposition': `attachment; filename="${folderName}.tar.gz"`
          })
          const tarProc = spawn('tar', ['-czf', '-', '-C', backupService.serverPath, folderName])
          tarProc.stdout.pipe(res)
          req.on('close', () => {
            try { tarProc.kill() } catch {}
          })
          tarProc.on('error', () => res.end())
          return
        }
      }

      const filePath = backupService.getBackupFilePath(filename)
      if (!filePath) {
        sendJson(res, 404, { error: 'Arquivo de backup não encontrado no servidor' })
        return
      }

      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${path.basename(filePath)}"`
      })
      const stream = fsSync.createReadStream(filePath)
      stream.pipe(res)
      return
    }

    // Servir frontend estático (dist/) em produção
    const served = await serveStaticFile(pathname, res)
    if (!served) {
      sendJson(res, 404, { error: 'Rota não encontrada' })
    }
  } catch (err) {
    sendJson(res, 500, { error: 'Erro interno no servidor', details: err.message })
  }
})

server.listen(PORT, () => {
  console.log(`[PokeHub API] Rodando em http://localhost:${PORT} (provider: ${dashboardService.activeProviderName})`)
})

