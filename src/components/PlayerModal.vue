<script setup>
import { ref } from 'vue'
import { X, Sparkles, Award, Shield, Heart, Zap, Crosshair } from 'lucide-vue-next'
import { getPokemonSprite, typeColors, regions } from '../data/mockData'

const props = defineProps({
  player: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

const activeModalTab = ref('party') // 'party', 'legendaries', 'shinies', 'pokedex'
</script>

<template>
  <div v-if="player" class="modal-backdrop" @click.self="emit('close')">
    <div class="modal-card glass-panel">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="player-header-info">
          <div class="avatar-box">
            <img :src="player.avatar" :alt="player.username" class="modal-avatar" />
            <span v-if="player.isOnline" class="modal-online-indicator"></span>
          </div>
          <div>
            <div class="player-title-row">
              <h2 class="modal-username">{{ player.username }}</h2>
              <span class="badge" :class="player.isOnline ? 'badge-online' : 'badge-offline'">
                {{ player.isOnline ? 'Online no Servidor' : 'Offline' }}
              </span>
            </div>
            <p class="modal-rank">{{ player.rank }} • {{ player.playTime }} jogadas</p>
          </div>
        </div>

        <button class="close-btn" @click="emit('close')">
          <X :size="20" />
        </button>
      </div>

      <!-- Quick Metrics Ribbon -->
      <div class="metrics-ribbon">
        <div class="metric-item">
          <span class="m-val">{{ player.totalCaptured }}</span>
          <span class="m-lbl">Capturados</span>
        </div>
        <div class="metric-item">
          <span class="m-val text-shiny">✨ {{ player.shiniesCount }}</span>
          <span class="m-lbl">Shinies</span>
        </div>
        <div class="metric-item">
          <span class="m-val text-legendary">👑 {{ player.legendariesCount }}</span>
          <span class="m-lbl">Lendários</span>
        </div>
      </div>

      <!-- Modal Tabs -->
      <div class="modal-tabs">
        <button 
          :class="['m-tab', { active: activeModalTab === 'party' }]"
          @click="activeModalTab = 'party'"
        >
          Equipe Atual (Party)
        </button>
        <button 
          :class="['m-tab', { active: activeModalTab === 'legendaries' }]"
          @click="activeModalTab = 'legendaries'"
        >
          👑 Lendários ({{ player.legendaries ? player.legendaries.length : 0 }})
        </button>
        <button 
          :class="['m-tab', { active: activeModalTab === 'shinies' }]"
          @click="activeModalTab = 'shinies'"
        >
          ✨ Shinies ({{ player.shiniesHighlights ? player.shiniesHighlights.length : 0 }})
        </button>
        <button 
          :class="['m-tab', { active: activeModalTab === 'pokedex' }]"
          @click="activeModalTab = 'pokedex'"
        >
          Pokédex Regional
        </button>
      </div>

      <!-- Tab Content: Party -->
      <div v-if="activeModalTab === 'party'" class="tab-pane">
        <div class="party-grid">
          <div 
            v-for="(poke, index) in player.party" 
            :key="index"
            class="party-card"
            :class="{ 'shiny-border': poke.shiny, 'legendary-border': poke.isLegendary }"
          >
            <div class="poke-card-top">
              <span class="poke-lvl">Lv. {{ poke.level }}</span>
              <div class="poke-badges">
                <span v-if="poke.shiny" class="mini-tag shiny">✨ Shiny</span>
                <span v-if="poke.isLegendary" class="mini-tag legendary">👑 Lendário</span>
              </div>
            </div>

            <!-- Sprite -->
            <div class="poke-sprite-container">
              <img :src="getPokemonSprite(poke.id, poke.shiny)" :alt="poke.name" class="poke-sprite" />
            </div>

            <div class="poke-details">
              <h4 class="poke-name">{{ poke.name }}</h4>
              
              <!-- Types -->
              <div class="poke-types">
                <span 
                  v-for="t in poke.types" 
                  :key="t" 
                  class="type-pill"
                  :style="{ backgroundColor: typeColors[t] || '#666' }"
                >
                  {{ t }}
                </span>
              </div>

              <!-- IVs & Details -->
              <div class="poke-stats-row">
                <span class="poke-attr">IV: <strong>{{ poke.ivPercent }}%</strong></span>
                <span class="poke-attr">Natureza: <strong>{{ poke.nature }}</strong></span>
              </div>
              <div class="poke-stats-row">
                <span class="poke-attr">Habilidade: <strong>{{ poke.ability }}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Content: Legendaries -->
      <div v-if="activeModalTab === 'legendaries'" class="tab-pane">
        <div v-if="player.legendaries && player.legendaries.length" class="trophy-grid">
          <div 
            v-for="(leg, index) in player.legendaries" 
            :key="index"
            class="trophy-card glass-panel"
          >
            <img :src="getPokemonSprite(leg.id, leg.shiny)" :alt="leg.name" class="trophy-sprite animate-float" />
            <div class="trophy-info">
              <div class="trophy-title-row">
                <h4 class="trophy-name">{{ leg.name }}</h4>
                <span class="badge badge-legendary">Nível {{ leg.level }}</span>
              </div>
              <p class="trophy-location">📍 Capturado em: <strong>{{ leg.caughtAt }}</strong></p>
            </div>
          </div>
        </div>
        <p v-else class="empty-state">Nenhum lendário registrado ainda.</p>
      </div>

      <!-- Tab Content: Shinies -->
      <div v-if="activeModalTab === 'shinies'" class="tab-pane">
        <div v-if="player.shiniesHighlights && player.shiniesHighlights.length" class="trophy-grid">
          <div 
            v-for="(sh, index) in player.shiniesHighlights" 
            :key="index"
            class="trophy-card glass-panel shiny-highlight"
          >
            <img :src="getPokemonSprite(sh.id, true)" :alt="sh.name" class="trophy-sprite animate-float" />
            <div class="trophy-info">
              <div class="trophy-title-row">
                <h4 class="trophy-name text-shiny">✨ {{ sh.name }}</h4>
                <span class="badge badge-shiny">Lv. {{ sh.level }}</span>
              </div>
              <p class="trophy-location">Forma cromática raríssima com partículas brilhantes</p>
            </div>
          </div>
        </div>
        <p v-else class="empty-state">Nenhum shiny registrado ainda.</p>
      </div>

      <!-- Tab Content: Regional Pokedex -->
      <div v-if="activeModalTab === 'pokedex'" class="tab-pane">
        <div class="regional-breakdown-grid">
          <div 
            v-for="region in regions" 
            :key="region.id"
            class="region-progress-box glass-panel"
          >
            <div class="box-top">
              <span class="box-reg-name">{{ region.name }}</span>
              <span class="box-reg-count">
                {{ player.pokedexProgress[region.id]?.caught || 0 }} / {{ region.total }}
              </span>
            </div>
            <div class="box-progress-bar">
              <div 
                class="box-fill" 
                :style="{ 
                  width: `${Math.min(100, ((player.pokedexProgress[region.id]?.caught || 0) / region.total) * 100)}%`,
                  background: region.color
                }"
              ></div>
            </div>
            <span class="box-pct">
              {{ Math.round(((player.pokedexProgress[region.id]?.caught || 0) / region.total) * 100) }}% Concluído
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(4, 9, 23, 0.82);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-card {
  width: 100%;
  max-width: 860px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: rgba(14, 23, 48, 0.95);
  border: 1px solid rgba(56, 189, 248, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.75rem;
  border-bottom: 1px solid var(--glass-border);
}

.player-header-info {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.avatar-box {
  position: relative;
  width: 60px;
  height: 60px;
}

.modal-avatar {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-md);
  background: #0b1329;
  border: 2px solid rgba(255, 255, 255, 0.2);
  image-rendering: pixelated;
}

.modal-online-indicator {
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #10b981;
  border: 2px solid #0e1730;
  box-shadow: 0 0 8px #10b981;
}

.player-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-username {
  font-size: 1.4rem;
  font-weight: 800;
  color: #ffffff;
}

.modal-rank {
  font-size: 0.85rem;
  color: var(--accent-cyan);
}

.close-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--glass-border);
  color: var(--text-muted);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border-color: #ef4444;
}

/* Metrics Ribbon */
.metrics-ribbon {
  display: flex;
  background: rgba(10, 17, 40, 0.6);
  border-bottom: 1px solid var(--glass-border);
  padding: 0.85rem 1.75rem;
  gap: 2.5rem;
}

.metric-item {
  display: flex;
  flex-direction: column;
}

.m-val {
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffffff;
}

.m-lbl {
  font-size: 0.75rem;
  color: var(--text-dim);
}

.text-shiny {
  color: #facc15;
}

.text-legendary {
  color: #c084fc;
}

/* Modal Tabs */
.modal-tabs {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  border-bottom: 1px solid var(--glass-border);
  overflow-x: auto;
}

.m-tab {
  background: transparent;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  font-family: var(--font-family);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
}

.m-tab:hover {
  color: var(--text-main);
}

.m-tab.active {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
}

/* Tab Content */
.tab-pane {
  padding: 1.75rem;
  overflow-y: auto;
  max-height: 550px;
}

/* Party Grid */
.party-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

.party-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  transition: var(--transition);
}

.party-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.06);
}

.party-card.shiny-border {
  border-color: rgba(250, 204, 21, 0.5);
  box-shadow: 0 0 12px rgba(250, 204, 21, 0.15);
}

.party-card.legendary-border {
  border-color: rgba(192, 132, 252, 0.5);
  box-shadow: 0 0 12px rgba(192, 132, 252, 0.15);
}

.poke-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.poke-lvl {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent-cyan);
}

.poke-badges {
  display: flex;
  gap: 0.3rem;
}

.mini-tag {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.1rem 0.35rem;
  border-radius: var(--radius-sm);
}

.mini-tag.shiny {
  background: rgba(250, 204, 21, 0.2);
  color: #fde047;
}

.mini-tag.legendary {
  background: rgba(192, 132, 252, 0.2);
  color: #d8b4fe;
}

.poke-sprite-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90px;
  margin: 0.5rem 0;
}

.poke-sprite {
  max-width: 80px;
  max-height: 80px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.poke-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
}

.poke-types {
  display: flex;
  gap: 0.35rem;
  margin: 0.4rem 0;
}

.type-pill {
  font-size: 0.65rem;
  font-weight: 700;
  color: #ffffff;
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-sm);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

.poke-stats-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-dim);
  margin-top: 0.2rem;
}

.poke-attr strong {
  color: var(--text-main);
}

/* Trophy Grid */
.trophy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.25rem;
}

.trophy-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem;
}

.trophy-sprite {
  width: 75px;
  height: 75px;
  object-fit: contain;
}

.trophy-info {
  flex: 1;
}

.trophy-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.35rem;
}

.trophy-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
}

.trophy-location {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.trophy-location strong {
  color: var(--accent-cyan);
}

/* Regional Breakdown Grid */
.regional-breakdown-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.25rem;
}

.region-progress-box {
  padding: 1.25rem;
}

.box-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.box-reg-name {
  font-weight: 700;
  color: #ffffff;
  font-size: 0.95rem;
}

.box-reg-count {
  font-size: 0.8rem;
  font-family: var(--font-mono);
  color: var(--text-muted);
}

.box-progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: 0.4rem;
}

.box-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.6s ease;
}

.box-pct {
  font-size: 0.75rem;
  color: var(--text-dim);
}

.empty-state {
  text-align: center;
  color: var(--text-dim);
  padding: 3rem 0;
}
</style>
