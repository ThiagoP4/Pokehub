<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import HeroSection from './components/HeroSection.vue'
import StatsOverview from './components/StatsOverview.vue'
import Leaderboard from './components/Leaderboard.vue'
import PokedexView from './components/PokedexView.vue'
import TrophiesView from './components/TrophiesView.vue'
import BackupsView from './components/BackupsView.vue'
import PlayerModal from './components/PlayerModal.vue'

import { serverInfo as initialServerInfo, playersData as initialPlayersData, getPokemonSprite } from './data/mockData'

const activeTab = ref('overview')
const searchQuery = ref('')
const selectedPlayer = ref(null)

const serverState = ref({ ...initialServerInfo })
const playersState = ref([...initialPlayersData])

async function loadDashboardFromApi() {
  try {
    const res = await fetch('/api/dashboard')
    if (!res.ok) return
    const data = await res.json()
    if (data?.serverInfo) {
      serverState.value = data.serverInfo
    }
    if (Array.isArray(data?.playersData) && data.playersData.length > 0) {
      playersState.value = data.playersData
    }
  } catch {
    // Mantém dados locais caso o frontend rode isolado sem o backend
  }
}

onMounted(() => {
  loadDashboardFromApi()
})

// Filtragem de jogadores por busca
const filteredPlayers = computed(() => {
  if (!searchQuery.value.trim()) {
    return playersState.value
  }
  const query = searchQuery.value.toLowerCase().trim()
  return playersState.value.filter(p => 
    p.username.toLowerCase().includes(query) ||
    p.rank.toLowerCase().includes(query) ||
    p.party.some(poke => poke.name.toLowerCase().includes(query))
  )
})

function handleSelectPlayer(player) {
  selectedPlayer.value = player
}

function handleCloseModal() {
  selectedPlayer.value = null
}
</script>

<template>
  <div class="dashboard-shell">
    <!-- Barra Lateral Fixa (Sidebar) -->
    <Navbar 
      :serverInfo="serverState"
      :players="playersState"
      :searchQuery="searchQuery"
      :activeTab="activeTab"
      @update:searchQuery="searchQuery = $event"
      @changeTab="activeTab = $event"
      @selectPlayer="handleSelectPlayer"
    />

    <!-- Área Principal do Dashboard (troca conforme a aba ativa) -->
    <main class="dashboard-main">
      <!-- ABA 1: VISÃO GERAL -->
      <div v-if="activeTab === 'overview'" class="tab-view">
        <HeroSection 
          :serverInfo="serverState"
          :players="playersState"
          @changeTab="activeTab = $event"
          @selectPlayer="handleSelectPlayer"
        />

        <StatsOverview 
          :players="filteredPlayers"
          :serverInfo="serverState"
          @selectPlayer="handleSelectPlayer"
          @changeTab="activeTab = $event"
        />
      </div>

      <!-- ABA 2: AMIGOS & EQUIPES -->
      <div v-else-if="activeTab === 'leaderboard'" class="tab-view">
        <Leaderboard 
          :players="filteredPlayers"
          @selectPlayer="handleSelectPlayer"
        />

        <!-- Prévia rápida das equipes de cada amigo -->
        <div class="teams-preview-section">
          <h3 class="subsection-title">Equipes Atuais (Party)</h3>
          <div class="teams-grid">
            <div 
              v-for="p in filteredPlayers" 
              :key="p.uuid" 
              class="friend-team-card glass-panel"
              @click="handleSelectPlayer(p)"
            >
              <div class="ft-header">
                <div class="ft-user">
                  <img :src="p.avatar" :alt="p.username" class="ft-avatar" />
                  <div>
                    <h4 class="ft-name">{{ p.username }}</h4>
                    <span class="ft-sub">{{ p.rank }}</span>
                  </div>
                </div>
                <span class="badge" :class="p.isOnline ? 'badge-online' : ''">
                  {{ p.isOnline ? 'Online' : 'Offline' }}
                </span>
              </div>

              <div class="ft-party-slots">
                <div 
                  v-for="(poke, i) in p.party" 
                  :key="i" 
                  class="ft-slot"
                  :title="`${poke.name} (Lv. ${poke.level})`"
                >
                  <img :src="getPokemonSprite(poke.id, poke.shiny)" :alt="poke.name" class="ft-poke-sprite" />
                  <span class="ft-poke-lvl">Lv.{{ poke.level }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ABA 3: POKÉDEX REGIONAL -->
      <div v-else-if="activeTab === 'pokedex'" class="tab-view">
        <PokedexView 
          :players="playersState"
          :selectedPlayer="selectedPlayer"
        />
      </div>

      <!-- ABA 4: LENDÁRIOS & SHINIES -->
      <div v-else-if="activeTab === 'trophies'" class="tab-view">
        <TrophiesView 
          :players="filteredPlayers"
          @selectPlayer="handleSelectPlayer"
        />
      </div>

      <!-- ABA 5: BACKUPS DO MAPA -->
      <div v-else-if="activeTab === 'backups'" class="tab-view">
        <BackupsView />
      </div>
    </main>

    <!-- Modal de Detalhes do Jogador -->
    <PlayerModal 
      :player="selectedPlayer"
      @close="handleCloseModal"
    />
  </div>
</template>

<style scoped>
.dashboard-shell {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.dashboard-main {
  flex: 1;
  min-width: 0;
  padding: 2rem 2.5rem;
  width: 100%;
}

.tab-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: fadeIn 0.22s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Teams Preview Section in Tab 2 */
.teams-preview-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.subsection-title {
  font-size: 1.35rem;
  font-weight: 900;
  color: var(--neo-ink);
  letter-spacing: -0.02em;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 1.25rem;
}

.friend-team-card {
  padding: 1.25rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.friend-team-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--elevation-3);
}

.ft-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ft-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.ft-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-xs);
  border: var(--neo-border);
  box-shadow: 1.5px 1.5px 0px var(--neo-ink);
  image-rendering: pixelated;
  background: var(--neo-bg-alt);
}

.ft-name {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--neo-ink);
}

.ft-sub {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--neo-ink-light);
}

.ft-party-slots {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
}

.ft-slot {
  background: var(--neo-surface-inset);
  border: 1.5px solid var(--neo-ink);
  box-shadow: inset 1px 1px 0px rgba(24, 24, 27, 0.15);
  border-radius: var(--radius-xs);
  padding: 0.45rem 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
}

.ft-poke-sprite {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.ft-poke-lvl {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 800;
  color: var(--neo-ink-muted);
}

@media (max-width: 900px) {
  .dashboard-shell {
    flex-direction: column;
  }
  .dashboard-main {
    padding: 1.25rem;
  }
  .ft-party-slots {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
