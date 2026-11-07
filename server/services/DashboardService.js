import { FileSystemProvider } from '../providers/FileSystemProvider.js'
import { DatabaseProvider } from '../providers/DatabaseProvider.js'

export class DashboardService {
  constructor() {
    this.fsProvider = new FileSystemProvider()
    this.dbProvider = new DatabaseProvider({ fallbackProvider: this.fsProvider })
  }

  get activeProviderName() {
    return process.env.DATA_PROVIDER === 'database' ? 'database' : 'filesystem'
  }

  get activeProvider() {
    return this.activeProviderName === 'database' ? this.dbProvider : this.fsProvider
  }

  async getDashboardData() {
    const playersData = await this.activeProvider.getPlayers()
    const onlinePlayers = playersData.filter(p => p.isOnline).length

    const serverInfo = {
      name: process.env.SERVER_NAME || 'PokeHub',
      subtitle:
        'Acompanhe a nossa jornada no servidor — veja quem está liderando a Pokédex, os Shinies que já brilharam e os Lendários capturados pela galera.',
      version: process.env.SERVER_VERSION || 'Minecraft 1.21.1 • Cobblemon 1.6',
      onlinePlayers,
      totalPlayers: playersData.length
    }

    return {
      provider: this.activeProviderName,
      serverInfo,
      playersData
    }
  }

  async getPlayerByUsername(username) {
    const players = await this.activeProvider.getPlayers()
    const target = String(username || '').toLowerCase()
    return players.find(p => p.username.toLowerCase() === target) || null
  }
}

