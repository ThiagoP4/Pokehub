<script setup>
import { ref, computed } from 'vue'
import Navbar from './components/Navbar.vue'
import HeroSection from './components/HeroSection.vue'
import StatsOverview from './components/StatsOverview.vue'
import Leaderboard from './components/Leaderboard.vue'
import PokedexView from './components/PokedexView.vue'
import PlayerModal from './components/PlayerModal.vue'

import { serverInfo, playersData } from './data/mockData'

const activeTab = ref('overview')
const searchQuery = ref('')
const selectedPlayer = ref(null)

// Filtragem de jogadores por busca
const filteredPlayers = computed(() => {
  if (!searchQuery.value.trim()) {
    return playersData
  }
  const query = searchQuery.value.toLowerCase().trim()
  return playersData.filter(p => 
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
  <div class="app-wrapper">
    <!-- Navbar -->
    <Navbar 
      :serverInfo="serverInfo"
      :searchQuery="searchQuery"
      :activeTab="activeTab"
      @update:searchQuery="searchQuery = $event"
      @changeTab="activeTab = $event"
    />

    <!-- Hero Banner (Cobblemon Inspired) -->
    <HeroSection 
      :serverInfo="serverInfo"
    />

    <!-- Main Content Area -->
    <main class="main-content">
      <!-- Seção 1: Métricas e Destaques (Overview) -->
      <section v-show="activeTab === 'overview' || activeTab === 'players'">
        <StatsOverview 
          :players="filteredPlayers"
          :serverInfo="serverInfo"
          @selectPlayer="handleSelectPlayer"
          @changeTab="activeTab = $event"
        />
      </section>

      <!-- Seção 2: Leaderboards / Classificação -->
      <section v-show="activeTab === 'overview' || activeTab === 'leaderboard' || activeTab === 'players'">
        <Leaderboard 
          :players="filteredPlayers"
          @selectPlayer="handleSelectPlayer"
        />
      </section>

      <!-- Seção 3: Pokédex por Região -->
      <section v-show="activeTab === 'overview' || activeTab === 'pokedex'">
        <PokedexView 
          :players="playersData"
          :selectedPlayer="selectedPlayer"
        />
      </section>
    </main>

    <!-- Modal de Detalhes do Jogador -->
    <PlayerModal 
      :player="selectedPlayer"
      @close="handleCloseModal"
    />

    <!-- Footer -->
    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-left">
          <div class="footer-brand">
            <span class="f-title">cobblemon</span>
            <span class="f-badge">POKEHUB</span>
          </div>
          <p class="f-desc">
            Painel comunitário do servidor {{ serverInfo.name }}. Desenvolvido para celebrar o progresso de cada treinador.
          </p>
        </div>

        <div class="footer-right">
          <span class="f-note">Cobblemon é um mod de código aberto para Minecraft.</span>
          <span class="f-copy">© 2026 PokéHub • Feito com Vue 3 & CSS Puro</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

/* Footer */
.footer {
  background: #060b1b;
  border-top: 1px solid var(--glass-border);
  padding: 3.5rem 0 2.5rem;
  margin-top: 4rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.f-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #ffffff;
}

.f-badge {
  font-size: 0.65rem;
  font-weight: 800;
  background: var(--accent-ocean);
  color: #ffffff;
  padding: 0.15rem 0.4rem;
  border-radius: var(--radius-sm);
}

.f-desc {
  color: var(--text-muted);
  font-size: 0.85rem;
  max-width: 400px;
}

.footer-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.f-note {
  font-size: 0.8rem;
  color: var(--text-dim);
}

.f-copy {
  font-size: 0.75rem;
  color: var(--text-dim);
}

@media (max-width: 768px) {
  .footer-right {
    align-items: flex-start;
  }
}
</style>
