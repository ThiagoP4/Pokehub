/**
 * Adaptador de Banco de Dados (PostgreSQL / MongoDB)
 * Deixado pronto na arquitetura para quando o servidor sincronizar os dados
 * para a jail `database` (10.15.89.50) ou `mongodb` (10.15.88.50).
 */
export class DatabaseProvider {
  constructor(options = {}) {
    this.connectionString = options.connectionString || process.env.DATABASE_URL || ''
    this.fallbackProvider = options.fallbackProvider || null
  }

  async getPlayers() {
    // Quando DATABASE_URL estiver configurado e o driver/sincronizador ativo,
    // a consulta SQL/Mongo entra diretamente aqui mantendo o mesmo contrato JSON.
    if (this.fallbackProvider) {
      return this.fallbackProvider.getPlayers()
    }
    return []
  }
}

