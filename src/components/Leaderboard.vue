<script setup>
import { ref, computed } from 'vue'
import { Trophy, Sparkles, Award, Clock, Eye, Crown, Medal } from 'lucide-vue-next'

const props = defineProps({
  players: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['selectPlayer'])

const activeFilter = ref('captured')

const sortedPlayers = computed(() => {
  const list = [...props.players]
  if (activeFilter.value === 'captured') {
    return list.sort((a, b) => b.totalCaptured - a.totalCaptured)
  }
  if (activeFilter.value === 'shinies') {
    return list.sort((a, b) => b.shiniesCount - a.shiniesCount)
  }
  if (activeFilter.value === 'legendaries') {
    return list.sort((a, b) => b.legendariesCount - a.legendariesCount)
  }
  if (activeFilter.value === 'playtime') {
    return list.sort((a, b) => parseInt(b.playTime) - parseInt(a.playTime))
  }
  return list
})

function getRankBadgeClass(index) {
  if (index === 0) return 'rank-first'
  if (index === 1) return 'rank-second'
  if (index === 2) return 'rank-third'
  return 'rank-other'
}
</script>

<template>
  <section class="leaderboard-section" id="rankings">
    <div class="section-header">
      <div>
        <h2 class="section-title">Classificação dos Amigos</h2>
        <p class="section-subtitle">Acompanhe a evolução de cada treinador no nosso mundo</p>
      </div>

      <!-- Filtros em Abas Táteis (Neo-Skeuo Tabs) -->
      <div class="filter-tabs">
        <button 
          :class="['filter-btn', { active: activeFilter === 'captured' }]"
          @click="activeFilter = 'captured'"
        >
          <Trophy :size="15" />
          <span>Capturas</span>
        </button>

        <button 
          :class="['filter-btn', { active: activeFilter === 'shinies' }]"
          @click="activeFilter = 'shinies'"
        >
          <Sparkles :size="15" />
          <span>Shinies</span>
        </button>

        <button 
          :class="['filter-btn', { active: activeFilter === 'legendaries' }]"
          @click="activeFilter = 'legendaries'"
        >
          <Award :size="15" />
          <span>Lendários</span>
        </button>

        <button 
          :class="['filter-btn', { active: activeFilter === 'playtime' }]"
          @click="activeFilter = 'playtime'"
        >
          <Clock :size="15" />
          <span>Tempo</span>
        </button>
      </div>
    </div>

    <!-- Tabela Neo-Skeuo com Contornos Fortes e Sombras -->
    <div class="table-container neo-card">
      <div class="table-header">
        <span class="col-rank">Posição</span>
        <span class="col-player">Treinador</span>
        <span class="col-stat">Pokémons</span>
        <span class="col-stat">Shinies</span>
        <span class="col-stat">Lendários</span>
        <span class="col-pokedex">Kanto Dex</span>
        <span class="col-actions">Ficha</span>
      </div>

      <div class="table-rows">
        <div 
          v-for="(player, index) in sortedPlayers" 
          :key="player.uuid"
          class="table-row"
          @click="emit('selectPlayer', player)"
        >
          <!-- Posição com Ícone Lucide -->
          <div class="col-rank">
            <span class="rank-tag" :class="getRankBadgeClass(index)">
              <Medal v-if="index < 3" :size="13" />
              <span>{{ index + 1 }}º</span>
            </span>
          </div>

          <!-- Treinador -->
          <div class="col-player">
            <div class="avatar-wrap">
              <img :src="player.avatar" :alt="player.username" class="player-avatar" />
              <span v-if="player.isOnline" class="online-indicator"></span>
            </div>
            <div class="player-details">
              <span class="player-username">{{ player.username }}</span>
              <span class="player-rank-label">{{ player.rank }}</span>
            </div>
          </div>

          <!-- Capturas -->
          <div class="col-stat">
            <span class="stat-number">{{ player.totalCaptured }}</span>
            <span class="stat-unit">pokémons</span>
          </div>

          <!-- Shinies -->
          <div class="col-stat">
            <span class="stat-number text-gold stat-with-icon">
              <Sparkles :size="14" />
              <span>{{ player.shiniesCount }}</span>
            </span>
          </div>

          <!-- Lendários -->
          <div class="col-stat">
            <span class="stat-number text-purple stat-with-icon">
              <Crown :size="14" />
              <span>{{ player.legendariesCount }}</span>
            </span>
          </div>

          <!-- Progresso Pokédex (Linear Progress estilo Kit) -->
          <div class="col-pokedex">
            <div class="linear-progress-track neo-card-inset">
              <div 
                class="linear-progress-fill" 
                :style="{ width: ((player.pokedexProgress.kanto.caught / 151) * 100) + '%' }"
              ></div>
            </div>
            <span class="progress-label">
              {{ player.pokedexProgress.kanto.caught }}/151 ({{ Math.round((player.pokedexProgress.kanto.caught / 151) * 100) }}%)
            </span>
          </div>

          <!-- Ação -->
          <div class="col-actions">
            <button class="btn btn-primary btn-inspect">
              <Eye :size="14" />
              <span>Ver</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.leaderboard-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 900;
  color: var(--neo-ink);
  letter-spacing: -0.02em;
}

.section-subtitle {
  color: var(--neo-ink-light);
  font-size: 0.92rem;
}

/* Tabs do Kit */
.filter-tabs {
  display: flex;
  background: var(--neo-bg-alt);
  padding: 0.25rem;
  border-radius: var(--radius-sm);
  border: var(--neo-border);
  gap: 0.25rem;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  background: transparent;
  border: none;
  border-radius: var(--radius-xs);
  color: var(--neo-ink-light);
  font-family: var(--font-family);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
}

.filter-btn:hover {
  color: var(--neo-ink);
}

.filter-btn.active {
  background: var(--neo-surface);
  color: var(--neo-ink);
  box-shadow: 1.5px 1.5px 0px var(--neo-ink);
  border: 1px solid var(--neo-ink);
}

/* Tabela Neo-Skeuo */
.table-container {
  overflow-x: auto;
}

.table-header {
  display: grid;
  grid-template-columns: 85px 2fr 1.1fr 1fr 1fr 1.8fr 100px;
  padding: 1rem 1.4rem;
  background: var(--neo-bg-alt);
  border-bottom: var(--neo-border);
  color: var(--neo-ink);
  font-size: 0.78rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  align-items: center;
}

.table-row {
  display: grid;
  grid-template-columns: 85px 2fr 1.1fr 1fr 1fr 1.8fr 100px;
  padding: 1rem 1.4rem;
  align-items: center;
  border-bottom: 1.5px solid #e4decb;
  cursor: pointer;
  background: var(--neo-surface);
  transition: var(--transition);
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: #fdfbf7;
}

/* Colunas */
.col-rank {
  display: flex;
  align-items: center;
}

.rank-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.82rem;
  font-weight: 800;
  font-family: var(--font-mono);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-xs);
  border: 1px solid var(--neo-ink);
  background: var(--neo-bg-alt);
}

.rank-first {
  background: #fef08a;
  box-shadow: 1.5px 1.5px 0px var(--neo-ink);
}

.rank-second {
  background: #e2e8f0;
  box-shadow: 1.5px 1.5px 0px var(--neo-ink);
}

.rank-third {
  background: #fed7aa;
  box-shadow: 1.5px 1.5px 0px var(--neo-ink);
}

.col-player {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.avatar-wrap {
  position: relative;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.player-avatar {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-xs);
  border: 1.5px solid var(--neo-ink);
  background: var(--neo-bg-alt);
  image-rendering: pixelated;
}

.online-indicator {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #10b981;
  border: 1.5px solid var(--neo-ink);
}

.player-details {
  display: flex;
  flex-direction: column;
}

.player-username {
  font-weight: 800;
  font-size: 0.95rem;
  color: var(--neo-ink);
}

.player-rank-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--neo-ink-light);
}

.col-stat {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-weight: 900;
  font-size: 1rem;
  color: var(--neo-ink);
  font-family: var(--font-mono);
}

.stat-with-icon {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.stat-unit {
  font-size: 0.68rem;
  color: var(--neo-ink-muted);
}

.text-gold {
  color: #b45309;
}

.text-purple {
  color: #6b21a8;
}

/* Linear Progress Bar (Skeuomorphic Inset) */
.col-pokedex {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding-right: 1.5rem;
}

.linear-progress-track {
  width: 100%;
  height: 10px;
  border-radius: var(--radius-full);
  overflow: hidden;
  border: 1.5px solid var(--neo-ink);
  padding: 1px;
}

.linear-progress-fill {
  height: 100%;
  background: #38bdf8;
  border-radius: var(--radius-full);
  border-right: 1.5px solid var(--neo-ink);
}

.progress-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--neo-ink-light);
  font-family: var(--font-mono);
}

.btn-inspect {
  padding: 0.35rem 0.7rem;
  font-size: 0.78rem;
}

@media (max-width: 950px) {
  .table-container {
    min-width: 760px;
  }
}
</style>
