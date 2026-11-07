<script setup>
import { ref } from 'vue'
import { X, Sparkles, Crown, MapPin } from 'lucide-vue-next'
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
    <!-- Modal no formato Neo-Skeuo Modal Confirmation (Borda Dupla e Sombra Marcante) -->
    <div class="modal-card neo-card-raised">
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
              <span class="badge" :class="player.isOnline ? 'badge-online' : ''">
                {{ player.isOnline ? 'Online no Servidor' : 'Offline' }}
              </span>
            </div>
            <p class="modal-rank">{{ player.rank }} • {{ player.playTime }} jogadas</p>
          </div>
        </div>

        <button class="btn btn-primary close-btn" @click="emit('close')">
          <X :size="18" />
        </button>
      </div>

      <!-- Quick Metrics Ribbon Inset -->
      <div class="metrics-ribbon neo-card-inset">
        <div class="metric-item">
          <span class="m-val">{{ player.totalCaptured }}</span>
          <span class="m-lbl">Capturados</span>
        </div>
        <div class="metric-item">
          <span class="m-val text-shiny stat-icon-val">
            <Sparkles :size="15" />
            <span>{{ player.shiniesCount }}</span>
          </span>
          <span class="m-lbl">Shinies</span>
        </div>
        <div class="metric-item">
          <span class="m-val text-legendary stat-icon-val">
            <Crown :size="15" />
            <span>{{ player.legendariesCount }}</span>
          </span>
          <span class="m-lbl">Lendários</span>
        </div>
      </div>

      <!-- Abas Internas estilo Kit -->
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
          <Crown :size="14" />
          <span>Lendários ({{ player.legendaries ? player.legendaries.length : 0 }})</span>
        </button>
        <button 
          :class="['m-tab', { active: activeModalTab === 'shinies' }]"
          @click="activeModalTab = 'shinies'"
        >
          <Sparkles :size="14" />
          <span>Shinies ({{ player.shiniesHighlights ? player.shiniesHighlights.length : 0 }})</span>
        </button>
        <button 
          :class="['m-tab', { active: activeModalTab === 'pokedex' }]"
          @click="activeModalTab = 'pokedex'"
        >
          Pokédex Regional
        </button>
      </div>

      <!-- Conteúdo da Aba: Party -->
      <div v-if="activeModalTab === 'party'" class="tab-pane">
        <div class="party-grid">
          <div 
            v-for="(poke, index) in player.party" 
            :key="index"
            class="party-card neo-card"
          >
            <div class="poke-card-top">
              <span class="poke-lvl">Lv. {{ poke.level }}</span>
              <div class="poke-badges">
                <span v-if="poke.shiny" class="badge badge-shiny">
                  <Sparkles :size="11" />
                  <span>Shiny</span>
                </span>
                <span v-if="poke.isLegendary" class="badge badge-legendary">
                  <Crown :size="11" />
                  <span>Lendário</span>
                </span>
              </div>
            </div>

            <!-- Sprite Box Inset -->
            <div class="poke-sprite-container neo-card-inset">
              <img :src="getPokemonSprite(poke.id, poke.shiny)" :alt="poke.name" class="poke-sprite animate-float" />
            </div>

            <div class="poke-details">
              <h4 class="poke-name">{{ poke.name }}</h4>
              
              <!-- Tipos com Pílulas Táteis -->
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

              <div class="poke-stats-row">
                <span>IVs: <strong>{{ poke.ivPercent }}%</strong></span>
                <span>Natureza: <strong>{{ poke.nature }}</strong></span>
              </div>
              <div class="poke-stats-row">
                <span>Habilidade: <strong>{{ poke.ability }}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Conteúdo da Aba: Lendários -->
      <div v-if="activeModalTab === 'legendaries'" class="tab-pane">
        <div v-if="player.legendaries && player.legendaries.length" class="trophy-grid">
          <div 
            v-for="(leg, index) in player.legendaries" 
            :key="index"
            class="trophy-card neo-card"
          >
            <div class="trophy-sprite-box neo-card-inset">
              <img :src="getPokemonSprite(leg.id, leg.shiny)" :alt="leg.name" class="trophy-sprite animate-float" />
            </div>
            <div class="trophy-info">
              <div class="trophy-title-row">
                <h4 class="trophy-name">{{ leg.name }}</h4>
                <span class="badge badge-legendary">Nível {{ leg.level }}</span>
              </div>
              <p class="trophy-location">
                <MapPin :size="13" class="location-icon" />
                <span>Capturado em: <strong>{{ leg.caughtAt }}</strong></span>
              </p>
            </div>
          </div>
        </div>
        <p v-else class="empty-state">Nenhum lendário registrado ainda.</p>
      </div>

      <!-- Conteúdo da Aba: Shinies -->
      <div v-if="activeModalTab === 'shinies'" class="tab-pane">
        <div v-if="player.shiniesHighlights && player.shiniesHighlights.length" class="trophy-grid">
          <div 
            v-for="(sh, index) in player.shiniesHighlights" 
            :key="index"
            class="trophy-card neo-card"
          >
            <div class="trophy-sprite-box neo-card-inset">
              <img :src="getPokemonSprite(sh.id, true)" :alt="sh.name" class="trophy-sprite animate-float" />
            </div>
            <div class="trophy-info">
              <div class="trophy-title-row">
                <h4 class="trophy-name text-shiny">
                  <Sparkles :size="15" />
                  <span>{{ sh.name }}</span>
                </h4>
                <span class="badge badge-shiny">Lv. {{ sh.level }}</span>
              </div>
              <p class="trophy-location">Forma cromática com partículas especiais</p>
            </div>
          </div>
        </div>
        <p v-else class="empty-state">Nenhum shiny registrado ainda.</p>
      </div>

      <!-- Conteúdo da Aba: Pokédex Regional -->
      <div v-if="activeModalTab === 'pokedex'" class="tab-pane">
        <div class="regional-breakdown-grid">
          <div 
            v-for="region in regions" 
            :key="region.id"
            class="region-progress-box neo-card"
          >
            <div class="box-top">
              <span class="box-reg-name">{{ region.name }}</span>
              <span class="box-reg-count">
                {{ player.pokedexProgress[region.id]?.caught || 0 }} / {{ region.total }}
              </span>
            </div>
            <div class="box-progress-track neo-card-inset">
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
  background: rgba(24, 24, 27, 0.65);
  backdrop-filter: blur(4px);
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
  background: var(--neo-surface);
  border: var(--neo-border-thick);
  box-shadow: 8px 8px 0px var(--neo-ink);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.35rem 1.6rem;
  border-bottom: var(--neo-border);
  background: var(--neo-bg);
}

.player-header-info {
  display: flex;
  align-items: center;
  gap: 1.15rem;
}

.avatar-box {
  position: relative;
  width: 54px;
  height: 54px;
}

.modal-avatar {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-sm);
  background: var(--neo-bg-alt);
  border: var(--neo-border);
  box-shadow: 2px 2px 0px var(--neo-ink);
  image-rendering: pixelated;
}

.modal-online-indicator {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #10b981;
  border: 1.5px solid var(--neo-ink);
}

.player-title-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.modal-username {
  font-size: 1.35rem;
  font-weight: 900;
  color: var(--neo-ink);
}

.modal-rank {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--neo-ink-light);
}

.close-btn {
  padding: 0.4rem 0.6rem;
  font-size: 0.85rem;
}

/* Metrics Ribbon */
.metrics-ribbon {
  display: flex;
  padding: 0.75rem 1.6rem;
  border-radius: 0;
  border-left: none;
  border-right: none;
  gap: 2.5rem;
}

.metric-item {
  display: flex;
  flex-direction: column;
}

.m-val {
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--neo-ink);
  font-family: var(--font-mono);
}

.stat-icon-val {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.m-lbl {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--neo-ink-muted);
}

.text-shiny {
  color: #b45309;
}

.text-legendary {
  color: #6b21a8;
}

/* Modal Tabs */
.modal-tabs {
  display: flex;
  gap: 0.4rem;
  padding: 0.65rem 1.6rem;
  border-bottom: var(--neo-border);
  background: var(--neo-bg);
  overflow-x: auto;
}

.m-tab {
  background: transparent;
  border: 1.5px solid transparent;
  padding: 0.45rem 0.85rem;
  border-radius: var(--radius-xs);
  color: var(--neo-ink-light);
  font-family: var(--font-family);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.m-tab:hover {
  color: var(--neo-ink);
}

.m-tab.active {
  background: var(--neo-surface);
  color: var(--neo-ink);
  border: var(--neo-border-thin);
  box-shadow: 1.5px 1.5px 0px var(--neo-ink);
}

/* Tab Pane */
.tab-pane {
  padding: 1.6rem;
  overflow-y: auto;
  max-height: 520px;
}

/* Party Grid */
.party-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.15rem;
}

.party-card {
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.poke-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.poke-lvl {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 900;
  color: var(--neo-ink);
}

.poke-badges {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.poke-sprite-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 85px;
  margin: 0.5rem 0;
  border-radius: var(--radius-sm);
}

.poke-sprite {
  max-width: 65px;
  max-height: 65px;
  object-fit: contain;
}

.poke-name {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--neo-ink);
}

.poke-types {
  display: flex;
  gap: 0.3rem;
  margin: 0.4rem 0;
}

.type-pill {
  font-size: 0.65rem;
  font-weight: 800;
  color: #ffffff;
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-xs);
  border: 1px solid var(--neo-ink);
  box-shadow: 1px 1px 0px var(--neo-ink);
}

.poke-stats-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: var(--neo-ink-light);
  margin-top: 0.2rem;
  font-weight: 600;
}

.poke-stats-row strong {
  color: var(--neo-ink);
}

/* Trophy Grid */
.trophy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
  gap: 1.15rem;
}

.trophy-card {
  display: flex;
  align-items: center;
  gap: 1.15rem;
  padding: 1.15rem;
}

.trophy-sprite-box {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.trophy-sprite {
  max-width: 58px;
  max-height: 58px;
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
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--neo-ink);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.trophy-location {
  font-size: 0.78rem;
  color: var(--neo-ink-light);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.location-icon {
  color: #ef4444;
  flex-shrink: 0;
}

/* Regional Breakdown Grid */
.regional-breakdown-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 1.15rem;
}

.region-progress-box {
  padding: 1.15rem;
}

.box-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}

.box-reg-name {
  font-weight: 800;
  color: var(--neo-ink);
  font-size: 0.92rem;
}

.box-reg-count {
  font-size: 0.78rem;
  font-family: var(--font-mono);
  color: var(--neo-ink-light);
  font-weight: 700;
}

.box-progress-track {
  height: 9px;
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: 0.35rem;
  border: 1px solid var(--neo-ink);
}

.box-fill {
  height: 100%;
  border-radius: var(--radius-full);
  border-right: 1px solid var(--neo-ink);
}

.box-pct {
  font-size: 0.72rem;
  color: var(--neo-ink-muted);
  font-weight: 700;
}

.empty-state {
  text-align: center;
  color: var(--neo-ink-muted);
  font-weight: 700;
  padding: 2.5rem 0;
}
</style>
