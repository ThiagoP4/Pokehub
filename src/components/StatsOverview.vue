<script setup>
import { computed } from 'vue'
import { Users, Sparkles, Flame, Award, ChevronRight, BookOpen, Crown, Backpack, Clock } from 'lucide-vue-next'
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

// Métricas somadas do grupo de amigos
const totalCaptured = computed(() => {
  return props.players.reduce((acc, p) => acc + p.totalCaptured, 0)
})

const totalShinies = computed(() => {
  return props.players.reduce((acc, p) => acc + p.shiniesCount, 0)
})

const totalLegendaries = computed(() => {
  return props.players.reduce((acc, p) => acc + p.legendariesCount, 0)
})

// Mais Shinies entre os amigos
const topShinyHunter = computed(() => {
  return [...props.players].sort((a, b) => b.shiniesCount - a.shiniesCount)[0]
})

// Mais Capturas entre os amigos
const topTrainer = computed(() => {
  return [...props.players].sort((a, b) => b.totalCaptured - a.totalCaptured)[0]
})
</script>

<template>
  <section class="overview-section">
    <!-- 4 Métricas Principais (Raised Surfaces com Sombra em Bloco) -->
    <div class="stats-grid">
      <!-- Card 1: Amigos no Mundo -->
      <div class="stat-card neo-card">
        <div class="stat-icon-wrapper blue-icon">
          <Users :size="22" />
        </div>
        <div class="stat-info">
          <span class="stat-label">Amigos no Servidor</span>
          <span class="stat-value">{{ serverInfo.totalPlayers }}</span>
          <span class="stat-subtext">
            <span class="status-indicator-dot"></span>
            {{ serverInfo.onlinePlayers }} online agora
          </span>
        </div>
      </div>

      <!-- Card 2: Total de Capturas -->
      <div class="stat-card neo-card">
        <div class="stat-icon-wrapper red-icon">
          <Flame :size="22" />
        </div>
        <div class="stat-info">
          <span class="stat-label">Total de Capturas</span>
          <span class="stat-value">{{ totalCaptured.toLocaleString() }}</span>
          <span class="stat-subtext">Equipes e Caixas do PC</span>
        </div>
      </div>

      <!-- Card 3: Shinies da Galera -->
      <div class="stat-card neo-card">
        <div class="stat-icon-wrapper yellow-icon">
          <Sparkles :size="22" />
        </div>
        <div class="stat-info">
          <span class="stat-label">Shinies Raros</span>
          <span class="stat-value text-shiny">{{ totalShinies }}</span>
          <span class="stat-subtext">Variantes cromáticas</span>
        </div>
      </div>

      <!-- Card 4: Lendários Capturados -->
      <div class="stat-card neo-card">
        <div class="stat-icon-wrapper purple-icon">
          <Award :size="22" />
        </div>
        <div class="stat-info">
          <span class="stat-label">Lendários Despertados</span>
          <span class="stat-value text-legendary">{{ totalLegendaries }}</span>
          <span class="stat-subtext">Monarcas do nosso mapa</span>
        </div>
      </div>
    </div>

    <!-- Cards de Destaque (Spotlight) estilo Neo-Skeuo Card & List -->
    <div class="spotlight-grid">
      <!-- Spotlight 1: Líder da Pokédex -->
      <div class="spotlight-card neo-card-raised" v-if="topTrainer">
        <div class="spotlight-header">
          <span class="badge badge-legendary">
            <BookOpen :size="13" />
            <span>Líder da Pokédex</span>
          </span>
          <button class="inspect-link-btn" @click="emit('selectPlayer', topTrainer)">
            <span>Ver Ficha</span>
            <ChevronRight :size="15" />
          </button>
        </div>

        <div class="spotlight-body">
          <img :src="topTrainer.avatar" :alt="topTrainer.username" class="trainer-avatar" />
          <div class="trainer-info">
            <h3 class="trainer-name">{{ topTrainer.username }}</h3>
            <p class="trainer-rank">{{ topTrainer.rank }}</p>
            <div class="trainer-pills">
              <span class="badge">
                <Backpack :size="12" />
                <span>{{ topTrainer.totalCaptured }} capturas</span>
              </span>
              <span class="badge">
                <Clock :size="12" />
                <span>{{ topTrainer.playTime }}</span>
              </span>
            </div>
          </div>
          
          <!-- Ace Pokémon Inset Frame -->
          <div class="trainer-ace neo-card-inset" v-if="topTrainer.party && topTrainer.party.length">
            <span class="ace-label">Parceiro</span>
            <img :src="getPokemonSprite(topTrainer.party[0].id, topTrainer.party[0].shiny)" class="ace-sprite animate-float" :alt="topTrainer.party[0].name" />
            <span class="ace-name">Lv.{{ topTrainer.party[0].level }} {{ topTrainer.party[0].name }}</span>
          </div>
        </div>
      </div>

      <!-- Spotlight 2: Mais Sortudo nos Shinies -->
      <div class="spotlight-card neo-card-raised" v-if="topShinyHunter">
        <div class="spotlight-header">
          <span class="badge badge-shiny">
            <Sparkles :size="13" />
            <span>Mestre dos Shinies</span>
          </span>
          <button class="inspect-link-btn" @click="emit('selectPlayer', topShinyHunter)">
            <span>Ver Coleção</span>
            <ChevronRight :size="15" />
          </button>
        </div>

        <div class="spotlight-body">
          <img :src="topShinyHunter.avatar" :alt="topShinyHunter.username" class="trainer-avatar" />
          <div class="trainer-info">
            <h3 class="trainer-name">{{ topShinyHunter.username }}</h3>
            <p class="trainer-rank">{{ topShinyHunter.rank }}</p>
            <div class="trainer-pills">
              <span class="badge badge-shiny">
                <Sparkles :size="12" />
                <span>{{ topShinyHunter.shiniesCount }} Shinies</span>
              </span>
              <span class="badge">
                <Crown :size="12" />
                <span>{{ topShinyHunter.legendariesCount }} Lendários</span>
              </span>
            </div>
          </div>

          <!-- Shiny Inset Frame -->
          <div class="trainer-ace neo-card-inset" v-if="topShinyHunter.shiniesHighlights && topShinyHunter.shiniesHighlights.length">
            <span class="ace-label">Destaque</span>
            <img 
              :src="getPokemonSprite(topShinyHunter.shiniesHighlights[0].id, true)" 
              class="ace-sprite animate-float" 
              :alt="topShinyHunter.shiniesHighlights[0].name" 
            />
            <span class="ace-name text-shiny">Shiny {{ topShinyHunter.shiniesHighlights[0].name }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.overview-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: -3.25rem;
  position: relative;
  z-index: 5;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1.15rem;
  padding: 1.35rem 1.4rem;
}

.stat-icon-wrapper {
  width: 50px;
  height: 50px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  border: var(--neo-border);
  box-shadow: 2px 2px 0px var(--neo-ink);
  flex-shrink: 0;
}

.blue-icon {
  background: #bae6fd;
  color: #0369a1;
}

.red-icon {
  background: #fecaca;
  color: #b91c1c;
}

.yellow-icon {
  background: #fef08a;
  color: #854d0e;
}

.purple-icon {
  background: #e9d5ff;
  color: #6b21a8;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--neo-ink-light);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.stat-value {
  font-size: 1.85rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: var(--neo-ink);
  line-height: 1.15;
}

.stat-subtext {
  font-size: 0.72rem;
  color: var(--neo-ink-muted);
  font-weight: 600;
  margin-top: 0.15rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.status-indicator-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  display: inline-block;
}

.text-shiny {
  color: #b45309;
}

.text-legendary {
  color: #6b21a8;
}

/* Spotlight Cards */
.spotlight-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 1.25rem;
}

.spotlight-card {
  padding: 1.5rem;
}

.spotlight-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.15rem;
}

.inspect-link-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: transparent;
  border: none;
  color: var(--neo-ink);
  font-family: var(--font-family);
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
  transition: var(--transition);
}

.inspect-link-btn:hover {
  transform: translateX(3px);
  color: var(--neo-blue);
}

.spotlight-body {
  display: flex;
  align-items: center;
  gap: 1.15rem;
}

.trainer-avatar {
  width: 68px;
  height: 68px;
  border-radius: var(--radius-sm);
  background: var(--neo-bg-alt);
  border: var(--neo-border);
  box-shadow: 2px 2px 0px var(--neo-ink);
  image-rendering: pixelated;
  flex-shrink: 0;
}

.trainer-info {
  flex: 1;
}

.trainer-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--neo-ink);
}

.trainer-rank {
  font-size: 0.82rem;
  color: var(--neo-blue);
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.trainer-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.trainer-ace {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.ace-label {
  font-size: 0.65rem;
  color: var(--neo-ink-muted);
  text-transform: uppercase;
  font-weight: 800;
}

.ace-sprite {
  width: 52px;
  height: 52px;
  object-fit: contain;
}

.ace-name {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--neo-ink);
}

@media (max-width: 600px) {
  .spotlight-body {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
