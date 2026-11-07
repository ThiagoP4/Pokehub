<script setup>
import { ref, computed } from 'vue'
import { Sparkles, Award, User, MapPin } from 'lucide-vue-next'
import { getPokemonSprite } from '../data/mockData'

const props = defineProps({
  players: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['selectPlayer'])

const activeCategory = ref('all') // 'all', 'legendaries', 'shinies'
const selectedFriend = ref('all')

const allLegendaries = computed(() => {
  const list = []
  props.players.forEach(player => {
    if (selectedFriend.value !== 'all' && player.username !== selectedFriend.value) return
    if (player.legendaries) {
      player.legendaries.forEach(leg => {
        list.push({
          ...leg,
          owner: player.username,
          ownerAvatar: player.avatar,
          playerObj: player
        })
      })
    }
  })
  return list
})

const allShinies = computed(() => {
  const list = []
  props.players.forEach(player => {
    if (selectedFriend.value !== 'all' && player.username !== selectedFriend.value) return
    if (player.shiniesHighlights) {
      player.shiniesHighlights.forEach(sh => {
        list.push({
          ...sh,
          owner: player.username,
          ownerAvatar: player.avatar,
          playerObj: player
        })
      })
    }
  })
  return list
})
</script>

<template>
  <div class="trophies-view">
    <div class="trophies-header">
      <div>
        <h2 class="view-title">Galeria de Troféus Raros</h2>
        <p class="view-subtitle">Lendários e Shinies descobertos pelos amigos no nosso mundo</p>
      </div>

      <div class="trophies-controls">
        <!-- Filtro por Amigo -->
        <div class="friend-selector">
          <User :size="15" class="select-icon" />
          <select v-model="selectedFriend" class="neo-input friend-select">
            <option value="all">Todos os amigos</option>
            <option v-for="p in players" :key="p.uuid" :value="p.username">
              {{ p.username }}
            </option>
          </select>
        </div>

        <!-- Abas Táteis de Categoria -->
        <div class="category-tabs neo-card-inset">
          <button 
            :class="['cat-btn', { active: activeCategory === 'all' }]"
            @click="activeCategory = 'all'"
          >
            Todos
          </button>
          <button 
            :class="['cat-btn', { active: activeCategory === 'legendaries' }]"
            @click="activeCategory = 'legendaries'"
          >
            <Award :size="14" />
            Lendários ({{ allLegendaries.length }})
          </button>
          <button 
            :class="['cat-btn', { active: activeCategory === 'shinies' }]"
            @click="activeCategory = 'shinies'"
          >
            <Sparkles :size="14" />
            Shinies ({{ allShinies.length }})
          </button>
        </div>
      </div>
    </div>

    <!-- Seção de Lendários -->
    <div v-if="activeCategory === 'all' || activeCategory === 'legendaries'" class="rare-section">
      <div class="rare-section-title">
        <span class="badge badge-legendary">
          <Award :size="13" />
          <span>Lendários Registrados ({{ allLegendaries.length }})</span>
        </span>
      </div>

      <div v-if="allLegendaries.length" class="rare-grid">
        <div 
          v-for="(item, idx) in allLegendaries" 
          :key="'leg-' + idx"
          class="rare-card neo-card"
          @click="emit('selectPlayer', item.playerObj)"
        >
          <div class="rare-sprite-wrap neo-card-inset">
            <img :src="getPokemonSprite(item.id, item.shiny)" :alt="item.name" class="rare-sprite animate-float" />
          </div>

          <div class="rare-info">
            <div class="rare-top">
              <h4 class="rare-name">{{ item.name }}</h4>
              <span class="badge badge-legendary">Lv. {{ item.level }}</span>
            </div>
            <p class="rare-location">
              <MapPin :size="13" class="pin-icon" />
              <span>{{ item.caughtAt }}</span>
            </p>

            <div class="rare-owner">
              <img :src="item.ownerAvatar" :alt="item.owner" class="owner-mini-avatar" />
              <span>Treinador: <strong>{{ item.owner }}</strong></span>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="empty-msg">Nenhum lendário encontrado para este filtro.</p>
    </div>

    <!-- Seção de Shinies -->
    <div v-if="activeCategory === 'all' || activeCategory === 'shinies'" class="rare-section">
      <div class="rare-section-title">
        <span class="badge badge-shiny">
          <Sparkles :size="13" />
          <span>Shinies Encontrados ({{ allShinies.length }})</span>
        </span>
      </div>

      <div v-if="allShinies.length" class="rare-grid">
        <div 
          v-for="(item, idx) in allShinies" 
          :key="'sh-' + idx"
          class="rare-card neo-card"
          @click="emit('selectPlayer', item.playerObj)"
        >
          <div class="rare-sprite-wrap neo-card-inset">
            <img :src="getPokemonSprite(item.id, true)" :alt="item.name" class="rare-sprite animate-float" />
          </div>

          <div class="rare-info">
            <div class="rare-top">
              <h4 class="rare-name title-with-icon">
                <Sparkles :size="14" />
                <span>{{ item.name }}</span>
              </h4>
              <span class="badge badge-shiny">Lv. {{ item.level }}</span>
            </div>
            <p class="rare-location">Variante cromática com partículas</p>

            <div class="rare-owner">
              <img :src="item.ownerAvatar" :alt="item.owner" class="owner-mini-avatar" />
              <span>Treinador: <strong>{{ item.owner }}</strong></span>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="empty-msg">Nenhum shiny encontrado para este filtro.</p>
    </div>
  </div>
</template>

<style scoped>
.trophies-view {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.trophies-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.view-title {
  font-size: 1.75rem;
  font-weight: 900;
  color: var(--neo-ink);
  letter-spacing: -0.02em;
}

.view-subtitle {
  color: var(--neo-ink-light);
  font-size: 0.92rem;
}

.trophies-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.friend-selector {
  position: relative;
  display: flex;
  align-items: center;
}

.select-icon {
  position: absolute;
  left: 0.75rem;
  color: var(--neo-ink-light);
  pointer-events: none;
}

.friend-select {
  padding-left: 2.1rem;
  font-weight: 700;
  cursor: pointer;
}

.category-tabs {
  display: flex;
  padding: 0.25rem 0.35rem;
  gap: 0.25rem;
}

.cat-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.8rem;
  border: 1px solid transparent;
  border-radius: var(--radius-xs);
  background: transparent;
  color: var(--neo-ink-light);
  font-family: var(--font-family);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
}

.cat-btn.active {
  background: var(--neo-surface);
  border: 1px solid var(--neo-ink);
  color: var(--neo-ink);
  box-shadow: 1.5px 1.5px 0px var(--neo-ink);
}

.rare-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rare-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 1.25rem;
}

.rare-card {
  display: flex;
  align-items: center;
  gap: 1.15rem;
  padding: 1.15rem;
  cursor: pointer;
}

.rare-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--elevation-3);
}

.rare-sprite-wrap {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.rare-sprite {
  max-width: 60px;
  max-height: 60px;
  object-fit: contain;
}

.rare-info {
  flex: 1;
  min-width: 0;
}

.rare-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.rare-name {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--neo-ink);
}

.title-with-icon {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.rare-location {
  font-size: 0.78rem;
  color: var(--neo-ink-light);
  font-weight: 600;
  margin: 0.2rem 0 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.pin-icon {
  color: #ef4444;
  flex-shrink: 0;
}

.rare-owner {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.78rem;
  color: var(--neo-ink-light);
}

.rare-owner strong {
  color: var(--neo-ink);
}

.owner-mini-avatar {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  border: 1px solid var(--neo-ink);
  image-rendering: pixelated;
}

.empty-msg {
  color: var(--neo-ink-muted);
  font-size: 0.88rem;
  padding: 1rem 0;
}
</style>
