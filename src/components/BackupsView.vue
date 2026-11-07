<script setup>
import { ref, onMounted, computed } from 'vue'
import { HardDriveDownload, Archive, Calendar, FileArchive, CheckCircle2, Clock, RefreshCw, AlertCircle } from 'lucide-vue-next'

const backups = ref([
  {
    id: 'world-2026-11-06-snapshot.zip',
    filename: 'world-2026-11-06-snapshot.zip',
    displayName: 'Backup Recente • 06/11/2026',
    type: 'archive',
    sizeFormatted: '475 MB',
    createdAt: new Date().toISOString(),
    version: 'Minecraft 1.21.1 • Cobblemon 1.6',
    status: 'ready',
    notes: 'Snapshot automático pré-atualização'
  },
  {
    id: 'world-2026-10-28-semanal.zip',
    filename: 'world-2026-10-28-semanal.zip',
    displayName: 'Backup Semanal • 28/10/2026',
    type: 'archive',
    sizeFormatted: '422 MB',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    version: 'Minecraft 1.21.1 • Cobblemon 1.6',
    status: 'ready',
    notes: 'Backup completo do mapa e dados Cobblemon'
  },
  {
    id: 'world_backup',
    filename: 'world_backup',
    displayName: 'Cópia Standby (world_backup)',
    type: 'directory',
    sizeFormatted: '410 MB',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    version: 'Minecraft 1.21.1 • Cobblemon 1.6',
    status: 'ready',
    notes: 'Snapshot do diretório salvo no servidor'
  }
])

const loading = ref(false)
const downloadingId = ref(null)

async function fetchBackups() {
  loading.value = true
  try {
    const res = await fetch('/api/backups')
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        backups.value = data
      }
    }
  } catch (err) {
    console.warn('Erro ao carregar lista de backups, usando estado padrão:', err)
  } finally {
    loading.value = false
  }
}

function formatDate(isoStr) {
  if (!isoStr) return 'Data recente'
  try {
    const d = new Date(isoStr)
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return isoStr
  }
}

function handleDownload(backup) {
  downloadingId.value = backup.id
  const link = document.createElement('a')
  link.href = `/api/backups/download/${encodeURIComponent(backup.filename)}`
  link.setAttribute('download', backup.filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  setTimeout(() => {
    downloadingId.value = null
  }, 2000)
}

onMounted(() => {
  fetchBackups()
})
</script>

<template>
  <div class="backups-view">
    <!-- Cabeçalho Neo-Skeuo -->
    <div class="backups-header neo-card-raised">
      <div class="bh-left">
        <div class="bh-badge">
          <Archive :size="15" />
          <span>Central de Arquivamento</span>
        </div>
        <h2 class="bh-title">Backups do Mundo Cobblemon</h2>
        <p class="bh-desc">
          Faça o download das versões salvas do mapa, Pokédex e progresso de todos os jogadores para jogar offline ou garantir a segurança do servidor.
        </p>
      </div>

      <div class="bh-actions">
        <button class="btn btn-secondary" @click="fetchBackups" :disabled="loading">
          <RefreshCw :size="16" :class="{ 'spin-icon': loading }" />
          <span>{{ loading ? 'Atualizando...' : 'Recarregar Lista' }}</span>
        </button>
      </div>
    </div>

    <!-- Cards de Resumo & Status -->
    <div class="summary-grid">
      <div class="neo-card summary-card">
        <div class="sc-icon bg-green">
          <CheckCircle2 :size="24" />
        </div>
        <div class="sc-content">
          <span class="sc-label">Status do Mundo</span>
          <span class="sc-val">Sincronizado</span>
          <span class="sc-sub">Minecraft 1.21.1 Fabric</span>
        </div>
      </div>

      <div class="neo-card summary-card">
        <div class="sc-icon bg-yellow">
          <FileArchive :size="24" />
        </div>
        <div class="sc-content">
          <span class="sc-label">Versões Disponíveis</span>
          <span class="sc-val">{{ backups.length }} Cópias</span>
          <span class="sc-sub">Prontas para download</span>
        </div>
      </div>

      <div class="neo-card summary-card">
        <div class="sc-icon bg-blue">
          <Clock :size="24" />
        </div>
        <div class="sc-content">
          <span class="sc-label">Último Snapshot</span>
          <span class="sc-val">{{ formatDate(backups[0]?.createdAt) }}</span>
          <span class="sc-sub">Automático pelo servidor</span>
        </div>
      </div>
    </div>

    <!-- Lista de Versões de Backup -->
    <div class="backups-list-card neo-card">
      <div class="bl-header">
        <h3 class="bl-title">Versões e Snapshots Salvos</h3>
        <span class="badge badge-accent">{{ backups.length }} arquivos</span>
      </div>

      <div class="table-container">
        <table class="neo-table">
          <thead>
            <tr>
              <th>Versão / Nome</th>
              <th>Data do Backup</th>
              <th>Tamanho</th>
              <th>Tipo</th>
              <th>Anotações</th>
              <th class="th-actions">Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in backups" :key="b.id">
              <td>
                <div class="backup-name-cell">
                  <div class="backup-file-icon">
                    <FileArchive :size="20" />
                  </div>
                  <div>
                    <span class="backup-display-name">{{ b.displayName }}</span>
                    <span class="backup-filename">{{ b.filename }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="backup-date">
                  <Calendar :size="14" />
                  <span>{{ formatDate(b.createdAt) }}</span>
                </div>
              </td>
              <td>
                <span class="badge badge-mono">{{ b.sizeFormatted }}</span>
              </td>
              <td>
                <span class="badge" :class="b.type === 'archive' ? 'badge-online' : 'badge-neutral'">
                  {{ b.type === 'archive' ? '.ZIP Comprimido' : 'Diretório Snapshot' }}
                </span>
              </td>
              <td class="backup-notes">
                {{ b.notes }}
              </td>
              <td class="td-actions">
                <button 
                  class="btn btn-primary btn-sm btn-download"
                  @click="handleDownload(b)"
                  :disabled="downloadingId === b.id"
                >
                  <HardDriveDownload :size="15" />
                  <span>{{ downloadingId === b.id ? 'Baixando...' : 'Baixar Backup' }}</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.backups-view {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.backups-header {
  padding: 2rem 2.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  background: var(--neo-surface-card);
  border: var(--neo-border-thick);
}

.bh-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: var(--neo-accent-soft);
  color: var(--neo-ink);
  border: 1.5px solid var(--neo-ink);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.3rem 0.65rem;
  border-radius: var(--radius-xs);
  box-shadow: 1.5px 1.5px 0px var(--neo-ink);
  margin-bottom: 0.75rem;
}

.bh-title {
  font-size: 1.85rem;
  font-weight: 900;
  color: var(--neo-ink);
  letter-spacing: -0.025em;
  margin-bottom: 0.5rem;
}

.bh-desc {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--neo-ink-muted);
  max-width: 650px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
}

.summary-card {
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.sc-icon {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-sm);
  border: var(--neo-border);
  box-shadow: 2px 2px 0px var(--neo-ink);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--neo-ink);
  flex-shrink: 0;
}

.bg-green { background: #55efc4; }
.bg-yellow { background: var(--neo-accent); }
.bg-blue { background: #74b9ff; }

.sc-content {
  display: flex;
  flex-direction: column;
}

.sc-label {
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--neo-ink-light);
  letter-spacing: 0.04em;
}

.sc-val {
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--neo-ink);
  letter-spacing: -0.01em;
}

.sc-sub {
  font-size: 0.78rem;
  color: var(--neo-ink-muted);
  font-weight: 600;
}

.backups-list-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.bl-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bl-title {
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--neo-ink);
}

.table-container {
  overflow-x: auto;
}

.neo-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.neo-table th {
  padding: 0.85rem 1rem;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--neo-ink-light);
  border-bottom: 2px solid var(--neo-ink);
  background: var(--neo-bg-alt);
}

.neo-table td {
  padding: 1rem;
  border-bottom: 1.5px solid rgba(24, 24, 27, 0.12);
  vertical-align: middle;
}

.backup-name-cell {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.backup-file-icon {
  width: 36px;
  height: 36px;
  background: var(--neo-surface-inset);
  border: 1.5px solid var(--neo-ink);
  border-radius: var(--radius-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--neo-ink);
}

.backup-display-name {
  display: block;
  font-weight: 800;
  color: var(--neo-ink);
  font-size: 0.95rem;
}

.backup-filename {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--neo-ink-muted);
}

.backup-date {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--neo-ink-muted);
}

.badge-mono {
  font-family: var(--font-mono);
  background: var(--neo-surface-inset);
  border: 1.5px solid var(--neo-ink);
}

.badge-neutral {
  background: var(--neo-bg-alt);
  border: 1.5px solid var(--neo-ink);
  color: var(--neo-ink);
}

.backup-notes {
  font-size: 0.82rem;
  color: var(--neo-ink-light);
  font-style: italic;
  max-width: 250px;
}

.th-actions, .td-actions {
  text-align: right;
}

.btn-download {
  white-space: nowrap;
}

.spin-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 900px) {
  .backups-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

