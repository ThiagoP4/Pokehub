<script setup>
import { ref, computed } from 'vue'
import { Trophy, Sparkles, Award, Clock, ChevronRight, Eye } from 'lucide-vue-next'

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

function getRankMedal(index) {
  if (index === 0) return '🥇'
  if (index === 1) return '🥈'
  if (index === 2) return '🥉'
  return `#${index + 1}`
}
</script>

<template>
  <section class="leaderboard-section" id="rankings">
    <div class="container">
      <div class="section-header">
        <div>
          <h2 class="section-title">Classificação de Treinadores</h2>
          <p class="section-subtitle">Os maiores mestres Pokémon do servidor</p>
        </div>

        <!-- Filter tabs -->
        <div class="filter-tabs">
          <button 
            :class="['filter-btn', { active: activeFilter === 'captured' }]"
            @click="activeFilter = 'captured'"
          >
            <Trophy :size="16" />
            <span>Capturas</span>
          </button>

          <button 
            :class="['filter-btn', { active: activeFilter === 'shinies' }]"
            @click="activeFilter = 'shinies'"
          >
            <Sparkles :size="16" />
            <span>Shinies</span>
          </button>

          <button 
            :class="['filter-btn', { active: activeFilter === 'legendaries' }]"
            @click="activeFilter = 'legendaries'"
          >
            <Award :size="16" />
            <span>Lendários</span>
          </button>

          <button 
            :class="['filter-btn', { active: activeFilter === 'playtime' }]"
            @click="activeFilter = 'playtime'"
          >
            <Clock :size="16" />
            <span>Tempo</span>
          </button>
        </div>
      </div>

      <!-- Leaderboard List -->
      <div class="leaderboard-card glass-panel">
        <div class="table-header">
          <span class="col-rank">Posição</span>
          <span class="col-player">Treinador</span>
          <span class="col-stat">Pokémons</span>
          <span class="col-stat">Shinies</span>
          <span class="col-stat">Lendários</span>
          <span class="col-stat">Kanto Pokédex</span>
          <span class="col-actions">Ação</span>
        </div>

        <div class="table-rows">
          <div 
            v-for="(player, index) in sortedPlayers" 
            :key="player.uuid"
            class="table-row"
            @click="emit('selectPlayer', player)"
          >
            <!-- Rank Column -->
            <div class="col-rank">
              <span class="rank-badge" :class="getRankBadgeClass(index)">
                {{ getRankMedal(index) }}
              </span>
            </div>

            <!-- Player Column -->
            <div class="col-player">
              <div class="avatar-wrapper">
                <img :src="player.avatar" :alt="player.username" class="player-avatar" />
                <span v-if="player.isOnline" class="online-indicator" title="Online no Servidor"></span>
              </div>
              <div class="player-details">
                <span class="player-username">{{ player.username }}</span>
                <span class="player-rank-title">{{ player.rank }}</span>
              </div>
            </div>

            <!-- Stat 1: Total Captured -->
            <div class="col-stat">
              <span class="stat-main">{{ player.totalCaptured }}</span>
              <span class="stat-sub">pokémons</span>
            </div>

            <!-- Stat 2: Shinies -->
            <div class="col-stat">
              <span class="stat-main shiny-text">✨ {{ player.shiniesCount }}</span>
            </div>

            <!-- Stat 3: Legendaries -->
            <div class="col-stat">
              <span class="stat-main legendary-text">👑 {{ player.legendariesCount }}</span>
            </div>

            <!-- Stat 4: Kanto Pokédex Progress Bar -->
            <div class="col-stat col-pokedex">
              <div class="pokedex-progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: ((player.pokedexProgress.kanto.caught / 151) * 100) + '%' }"
                ></div>
              </div>
              <span class="pokedex-percent">
                {{ player.pokedexProgress.kanto.caught }} / 151 ({{ Math.round((player.pokedexProgress.kanto.caught / 151) * 100) }}%)
              </span>
            </div>

            <!-- Action: View details -->
            <div class="col-actions">
              <button class="inspect-btn">
                <Eye :size="16" />
                <span>Inspecionar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.leaderboard-section {
  padding: 3rem 0;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
}

.section-subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.filter-tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.3rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  gap: 0.25rem;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  font-family: var(--font-family);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.filter-btn:hover {
  color: var(--text-main);
}

.filter-btn.active {
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
}

/* Leaderboard Table */
.leaderboard-card {
  overflow-x: auto;
}

.table-header {
  display: grid;
  grid-template-columns: 80px 2.2fr 1.2fr 1.1fr 1.1fr 1.8fr 1.1fr;
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid var(--glass-border);
  color: var(--text-dim);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  align-items: center;
}

.table-row {
  display: grid;
  grid-template-columns: 80px 2.2fr 1.2fr 1.1fr 1.1fr 1.8fr 1.1fr;
  padding: 1.1rem 1.5rem;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  cursor: pointer;
  transition: var(--transition);
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: rgba(56, 189, 248, 0.06);
  transform: scale([1.002]);
}

/* Columns */
.col-rank {
  display: flex;
  align-items: center;
}

.rank-badge {
  font-size: 1.1rem;
  font-weight: 800;
  font-family: var(--font-mono);
}

.rank-first {
  filter: drop-shadow(0 0 8px rgba(250, 204, 21, 0.5));
}

.col-player {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-wrapper {
  position: relative;
  width: 44px;
  height: 44px;
}

.player-avatar {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-sm);
  background: #0f172a;
  image-rendering: pixelated;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.online-indicator {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #10b981;
  border: 2px solid var(--bg-primary);
  box-shadow: 0 0 6px #10b981;
}

.player-details {
  display: flex;
  flex-direction: column;
}

.player-username {
  font-weight: 700;
  font-size: 1rem;
  color: #ffffff;
}

.player-rank-title {
  font-size: 0.75rem;
  color: var(--accent-cyan);
}

.col-stat {
  display: flex;
  flex-direction: column;
}

.stat-main {
  font-weight: 700;
  font-size: 1.05rem;
  color: #ffffff;
}

.stat-sub {
  font-size: 0.7rem;
  color: var(--text-dim);
}

.shiny-text {
  color: #facc15;
}

.legendary-text {
  color: #c084fc;
}

/* Pokedex column */
.col-pokedex {
  width: 90%;
}

.pokedex-progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: 0.3rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0284c7, #38bdf8);
  border-radius: var(--radius-full);
  transition: width 0.5s ease;
}

.pokedex-percent {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

.inspect-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--glass-border);
  color: var(--text-main);
  font-family: var(--font-family);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.table-row:hover .inspect-btn {
  background: var(--accent-ocean);
  border-color: var(--accent-cyan);
  color: #ffffff;
}

@media (max-width: 950px) {
  .leaderboard-card {
    min-width: 800px;
  }
}
</style>
