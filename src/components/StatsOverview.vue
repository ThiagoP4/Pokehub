<script setup>
import { computed } from 'vue'
import { Users, Sparkles, Flame, Award, ChevronRight } from 'lucide-vue-next'
import { getPokemonSprite } from '../data/mockData'

const props = defineProps({
  players: {
    type: Array,
    required: true
  },
  serverInfo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['selectPlayer', 'changeTab'])

// Métricas agregadas
const totalCaptured = computed(() => {
  return props.players.reduce((acc, p) => acc + p.totalCaptured, 0)
})

const totalShinies = computed(() => {
  return props.players.reduce((acc, p) => acc + p.shiniesCount, 0)
})

const totalLegendaries = computed(() => {
  return props.players.reduce((acc, p) => acc + p.legendariesCount, 0)
})

// Top Shiny Hunter
const topShinyHunter = computed(() => {
  return [...props.players].sort((a, b) => b.shiniesCount - a.shiniesCount)[0]
})

// Top Treinador
const topTrainer = computed(() => {
  return [...props.players].sort((a, b) => b.totalCaptured - a.totalCaptured)[0]
})
</script>

<template>
  <section class="overview-section">
    <div class="container">
      <!-- 4 Main Metric Cards -->
      <div class="stats-grid">
        <!-- Card 1: Total Treinadores -->
        <div class="stat-card glass-panel">
          <div class="stat-icon-wrapper blue">
            <Users :size="24" />
          </div>
          <div class="stat-info">
            <span class="stat-label">Treinadores Ativos</span>
            <span class="stat-value">{{ serverInfo.totalRegistered }}</span>
            <span class="stat-subtext">🟢 {{ serverInfo.onlinePlayers }} no servidor agora</span>
          </div>
        </div>

        <!-- Card 2: Pokémons Capturados -->
        <div class="stat-card glass-panel">
          <div class="stat-icon-wrapper emerald">
            <Flame :size="24" />
          </div>
          <div class="stat-info">
            <span class="stat-label">Pokémons Registrados</span>
            <span class="stat-value">{{ totalCaptured.toLocaleString() }}</span>
            <span class="stat-subtext">Entre equipes e PCs</span>
          </div>
        </div>

        <!-- Card 3: Shinies Encontrados -->
        <div class="stat-card glass-panel">
          <div class="stat-icon-wrapper yellow">
            <Sparkles :size="24" />
          </div>
          <div class="stat-info">
            <span class="stat-label">Shinies Raros</span>
            <span class="stat-value glow-yellow">{{ totalShinies }}</span>
            <span class="stat-subtext">1 / 8192 taxa padrão Cobblemon</span>
          </div>
        </div>

        <!-- Card 4: Lendários Despertados -->
        <div class="stat-card glass-panel">
          <div class="stat-icon-wrapper purple">
            <Award :size="24" />
          </div>
          <div class="stat-info">
            <span class="stat-label">Lendários Despertados</span>
            <span class="stat-value glow-cyan">{{ totalLegendaries }}</span>
            <span class="stat-subtext">Monarcas dos Biomas</span>
          </div>
        </div>
      </div>

      <!-- Spotlight Cards (Destaques da Semana) -->
      <div class="spotlight-grid">
        <!-- Spotlight 1: Mestre da Temporada -->
        <div class="spotlight-card glass-panel" v-if="topTrainer">
          <div class="spotlight-header">
            <div class="badge badge-legendary">Líder do Servidor</div>
            <button class="view-profile-btn" @click="emit('selectPlayer', topTrainer)">
              Ver Perfil <ChevronRight :size="16" />
            </button>
          </div>

          <div class="spotlight-body">
            <img :src="topTrainer.avatar" :alt="topTrainer.username" class="trainer-avatar" />
            <div class="trainer-info">
              <h3 class="trainer-name">{{ topTrainer.username }}</h3>
              <p class="trainer-rank">{{ topTrainer.rank }}</p>
              <div class="trainer-pills">
                <span class="pill">🎒 {{ topTrainer.totalCaptured }} Capturados</span>
                <span class="pill">⏱️ {{ topTrainer.playTime }}</span>
              </div>
            </div>
            
            <!-- Ace Pokémon -->
            <div class="trainer-ace" v-if="topTrainer.party && topTrainer.party.length">
              <span class="ace-label">Pokémon Ás</span>
              <img :src="getPokemonSprite(topTrainer.party[0].id)" class="ace-sprite" :alt="topTrainer.party[0].name" />
              <span class="ace-name">Lv. {{ topTrainer.party[0].level }} {{ topTrainer.party[0].name }}</span>
            </div>
          </div>
        </div>

        <!-- Spotlight 2: Rei dos Shinies -->
        <div class="spotlight-card glass-panel" v-if="topShinyHunter">
          <div class="spotlight-header">
            <div class="badge badge-shiny">🌟 Caçador de Shinies #1</div>
            <button class="view-profile-btn" @click="emit('selectPlayer', topShinyHunter)">
              Ver Perfil <ChevronRight :size="16" />
            </button>
          </div>

          <div class="spotlight-body">
            <img :src="topShinyHunter.avatar" :alt="topShinyHunter.username" class="trainer-avatar" />
            <div class="trainer-info">
              <h3 class="trainer-name">{{ topShinyHunter.username }}</h3>
              <p class="trainer-rank">Mestre Brilhante</p>
              <div class="trainer-pills">
                <span class="pill shiny-pill">✨ {{ topShinyHunter.shiniesCount }} Shinies</span>
                <span class="pill">👑 {{ topShinyHunter.legendariesCount }} Lendários</span>
              </div>
            </div>

            <!-- Shiny Highlight Sprite -->
            <div class="trainer-ace" v-if="topShinyHunter.shiniesHighlights && topShinyHunter.shiniesHighlights.length">
              <span class="ace-label">Destaque Raro</span>
              <img 
                :src="getPokemonSprite(topShinyHunter.shiniesHighlights[0].id, true)" 
                class="ace-sprite animate-float" 
                :alt="topShinyHunter.shiniesHighlights[0].name" 
              />
              <span class="ace-name shiny-name">✨ Shiny {{ topShinyHunter.shiniesHighlights[0].name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.overview-section {
  padding: 2.5rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem;
}

.stat-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-wrapper.blue {
  background: rgba(2, 132, 199, 0.2);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.stat-icon-wrapper.emerald {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid rgba(52, 211, 153, 0.3);
}

.stat-icon-wrapper.yellow {
  background: rgba(250, 204, 21, 0.2);
  color: #facc15;
  border: 1px solid rgba(250, 204, 21, 0.3);
}

.stat-icon-wrapper.purple {
  background: rgba(192, 132, 252, 0.2);
  color: #c084fc;
  border: 1px solid rgba(192, 132, 252, 0.3);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-muted);
}

.stat-value {
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #ffffff;
  line-height: 1.2;
}

.stat-subtext {
  font-size: 0.75rem;
  color: var(--text-dim);
  margin-top: 0.2rem;
}

/* Spotlight Cards */
.spotlight-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 1.5rem;
}

.spotlight-card {
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.spotlight-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.view-profile-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: transparent;
  border: none;
  color: var(--accent-cyan);
  font-family: var(--font-family);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.view-profile-btn:hover {
  color: #ffffff;
  transform: translateX(3px);
}

.spotlight-body {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.trainer-avatar {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-md);
  background: #0f172a;
  border: 2px solid rgba(255, 255, 255, 0.15);
  image-rendering: pixelated;
  flex-shrink: 0;
}

.trainer-info {
  flex: 1;
}

.trainer-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
}

.trainer-rank {
  font-size: 0.85rem;
  color: var(--accent-cyan);
  margin-bottom: 0.5rem;
}

.trainer-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.pill {
  font-size: 0.75rem;
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-muted);
}

.shiny-pill {
  background: rgba(250, 204, 21, 0.15);
  color: #fde047;
  border: 1px solid rgba(250, 204, 21, 0.3);
}

.trainer-ace {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 0, 0, 0.25);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.ace-label {
  font-size: 0.65rem;
  color: var(--text-dim);
  text-transform: uppercase;
  font-weight: 700;
}

.ace-sprite {
  width: 58px;
  height: 58px;
  object-fit: contain;
}

.ace-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-main);
}

.shiny-name {
  color: #fde047;
}

@media (max-width: 600px) {
  .spotlight-body {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
