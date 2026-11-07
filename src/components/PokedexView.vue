<script setup>
import { ref, computed, watch } from 'vue'
import { regions, getPokemonSprite, getPokemonStaticSprite } from '../data/mockData'
import pokemonNames from '../data/pokemonNames.json'
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  players: {
    type: Array,
    required: true
  },
  selectedPlayer: {
    type: Object,
    default: null
  }
})

const selectedRegionId = ref('kanto')
const filterMode = ref('all') // 'all', 'caught', 'missing'
const selectedPlayerUuid = ref(props.players[0]?.uuid || '')
const currentPage = ref(1)
const PAGE_SIZE = 48

watch(
  () => props.players,
  (newPlayers) => {
    if (newPlayers?.length && !newPlayers.some(p => p.uuid === selectedPlayerUuid.value)) {
      selectedPlayerUuid.value = newPlayers[0].uuid
    }
  },
  { immediate: true }
)

const currentPlayer = computed(() => {
  if (props.selectedPlayer) return props.selectedPlayer
  return props.players.find(p => p.uuid === selectedPlayerUuid.value) || props.players[0] || {
    username: 'Carregando...',
    pokedexProgress: {},
    caughtIds: [],
    seenIds: [],
    shinyIds: [],
    party: [],
    legendaries: [],
    shiniesHighlights: []
  }
})

const activeRegion = computed(() => {
  return regions.find(r => r.id === selectedRegionId.value) || regions[0]
})

// Conjunto de Pokémon capturados pelo jogador ativo (100% Dados Reais)
const playerCaughtSet = computed(() => {
  const set = new Set()
  const player = currentPlayer.value
  if (!player) return set

  if (Array.isArray(player.caughtIds)) {
    player.caughtIds.forEach(id => set.add(id))
  }
  if (Array.isArray(player.party)) {
    player.party.forEach(p => set.add(p.id))
  }
  if (Array.isArray(player.legendaries)) {
    player.legendaries.forEach(l => set.add(l.id))
  }
  if (Array.isArray(player.shiniesHighlights)) {
    player.shiniesHighlights.forEach(s => set.add(s.id))
  }
  return set
})

const playerSeenSet = computed(() => {
  const set = new Set(playerCaughtSet.value)
  const player = currentPlayer.value
  if (Array.isArray(player?.seenIds)) {
    player.seenIds.forEach(id => set.add(id))
  }
  return set
})

const playerShinySet = computed(() => {
  const set = new Set()
  const player = currentPlayer.value
  if (!player) return set

  if (Array.isArray(player.shinyIds)) {
    player.shinyIds.forEach(id => set.add(id))
  }
  if (Array.isArray(player.party)) {
    player.party.filter(p => p.shiny).forEach(p => set.add(p.id))
  }
  if (Array.isArray(player.shiniesHighlights)) {
    player.shiniesHighlights.forEach(s => set.add(s.id))
  }
  return set
})

// Todos os Pokémon da região ativa (100% baseados nos registros reais do servidor)
const allRegionPokemonList = computed(() => {
  const [start, end] = activeRegion.value.range
  const list = []
  const caughtSet = playerCaughtSet.value
  const seenSet = playerSeenSet.value
  const shinySet = playerShinySet.value

  for (let id = start; id <= end; id++) {
    const isCaught = caughtSet.has(id)
    const isSeen = seenSet.has(id)
    const isShiny = shinySet.has(id)

    const rawName = pokemonNames[id - 1] || `Pokémon #${String(id).padStart(3, '0')}`
    const name = rawName.replace(/-/g, ' ')

    if (filterMode.value === 'caught' && !isCaught) continue
    if (filterMode.value === 'missing' && isCaught) continue

    list.push({
      id,
      number: `#${String(id).padStart(3, '0')}`,
      name,
      isCaught,
      isSeen,
      isShiny,
      sprite: getPokemonSprite(id, isShiny),
      fallbackSprite: getPokemonStaticSprite(id, isShiny)
    })
  }

  return list
})

const totalPages = computed(() => {
  return Math.ceil(allRegionPokemonList.value.length / PAGE_SIZE) || 1
})

const paginatedPokemonList = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return allRegionPokemonList.value.slice(start, start + PAGE_SIZE)
})

function changeRegion(regionId) {
  selectedRegionId.value = regionId
  currentPage.value = 1
}

function changeFilter(mode) {
  filterMode.value = mode
  currentPage.value = 1
}
</script>

<template>
  <section class="pokedex-section" id="pokedex">
    <!-- Header com Controles Táteis -->
    <div class="section-header">
      <div>
        <div class="badge badge-shiny">
          <BookOpen :size="14" />
          <span>Enciclopédia de Campo</span>
        </div>
        <h2 class="section-title">Pokédex Regional</h2>
        <p class="section-subtitle">
          Registros oficiais de <strong>{{ currentPlayer.username }}</strong>
        </p>
      </div>

      <div class="pokedex-controls">
        <!-- Seletor de Amigo (Pills Táteis) -->
        <div class="friend-pills neo-card-inset">
          <button
            v-for="p in players"
            :key="p.uuid"
            :class="['friend-pill-btn', { active: currentPlayer.uuid === p.uuid }]"
            @click="selectedPlayerUuid = p.uuid"
          >
            <img :src="p.avatar" :alt="p.username" class="pill-avatar" />
            <span>{{ p.username }}</span>
          </button>
        </div>

        <!-- Filtro: Todos / Capturados / Faltando -->
        <div class="display-filters neo-card-inset">
          <button 
            :class="['display-btn', { active: filterMode === 'all' }]"
            @click="changeFilter('all')"
          >
            Todos
          </button>
          <button 
            :class="['display-btn', { active: filterMode === 'caught' }]"
            @click="changeFilter('caught')"
          >
            <CheckCircle2 :size="14" />
            Pegou
          </button>
          <button 
            :class="['display-btn', { active: filterMode === 'missing' }]"
            @click="changeFilter('missing')"
          >
            Falta
          </button>
        </div>
      </div>
    </div>

    <!-- Seletor de Regiões estilo Folder Tabs do UI Kit -->
    <div class="region-tabs-container">
      <div class="region-tabs">
        <button 
          v-for="region in regions" 
          :key="region.id"
          :class="['region-tab-btn', { active: selectedRegionId === region.id }]"
          @click="changeRegion(region.id)"
        >
          <span class="region-name">{{ region.name }}</span>
          <span class="region-gen">{{ region.gen }}</span>
        </button>
      </div>
    </div>

    <!-- Cartão Resumo da Região Ativa -->
    <div class="region-summary-card neo-card">
      <div class="summary-info">
        <span class="badge">{{ activeRegion.gen }}</span>
        <h3 class="summary-region-name">Região de {{ activeRegion.name }}</h3>
        <p class="summary-desc">
          {{ currentPlayer.pokedexProgress?.[activeRegion.id]?.caught || 0 }} de {{ activeRegion.total }} espécies registradas por {{ currentPlayer.username }} ({{ currentPlayer.pokedexProgress?.[activeRegion.id]?.seen || 0 }} avistadas no mapa).
        </p>
      </div>

      <div class="summary-stats">
        <div class="stat-badge-neo neo-card-inset">
          <span class="circle-val">
            {{ Math.round(((currentPlayer.pokedexProgress?.[activeRegion.id]?.caught || 0) / activeRegion.total) * 100) }}%
          </span>
          <span class="circle-lbl">Concluído</span>
        </div>
      </div>
    </div>

    <!-- Grid de Pokémons estilo Cartões de Colecionador Neo-Skeuo -->
    <div class="pokemon-grid">
      <div 
        v-for="pkmn in paginatedPokemonList" 
        :key="pkmn.id"
        class="pokemon-card neo-card"
        :class="{ 'not-caught': !pkmn.isCaught, 'is-shiny': pkmn.isShiny }"
      >
        <div class="card-header">
          <span class="pkmn-number">{{ pkmn.number }}</span>
          <span v-if="pkmn.isShiny" class="badge badge-shiny">Shiny</span>
          <span v-else-if="pkmn.isCaught" class="badge badge-online">✓ Registrado</span>
          <span v-else-if="pkmn.isSeen" class="badge">Avistado</span>
        </div>

        <!-- Sprite Container Inset -->
        <div class="sprite-box neo-card-inset">
          <img 
            :src="pkmn.sprite" 
            :alt="pkmn.name" 
            class="pkmn-sprite"
            :class="{ 'silhouette': !pkmn.isCaught }"
            loading="lazy"
            @error="$event.target.src = pkmn.fallbackSprite"
          />
        </div>

        <div class="card-footer">
          <span class="pkmn-name">{{ pkmn.name }}</span>
          <span class="pkmn-status">
            {{ pkmn.isCaught ? 'Capturado' : pkmn.isSeen ? 'Apenas avistado' : 'Não encontrado' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Paginação Táteis Neo-Skeuo -->
    <div class="pagination-bar neo-card" v-if="totalPages > 1">
      <span class="page-info">
        Mostrando {{ (currentPage - 1) * PAGE_SIZE + 1 }} a {{ Math.min(currentPage * PAGE_SIZE, allRegionPokemonList.length) }} de {{ allRegionPokemonList.length }} espécies
      </span>

      <div class="page-controls">
        <button 
          class="btn btn-secondary btn-sm"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <ChevronLeft :size="16" />
          <span>Anterior</span>
        </button>

        <div class="page-pills">
          <button 
            v-for="p in totalPages" 
            :key="p"
            class="page-pill"
            :class="{ active: currentPage === p }"
            @click="currentPage = p"
          >
            {{ p }}
          </button>
        </div>

        <button 
          class="btn btn-secondary btn-sm"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          <span>Próxima</span>
          <ChevronRight :size="16" />
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pokedex-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  font-size: 1.85rem;
  font-weight: 900;
  color: var(--neo-ink);
  letter-spacing: -0.02em;
  margin-top: 0.25rem;
}

.section-subtitle {
  color: var(--neo-ink-light);
  font-size: 0.92rem;
}

.pokedex-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.friend-pills,
.display-filters {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.35rem;
  flex-wrap: wrap;
}

.friend-pill-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.65rem;
  border-radius: var(--radius-xs);
  border: 1px solid transparent;
  background: transparent;
  color: var(--neo-ink-light);
  font-family: var(--font-family);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
}

.friend-pill-btn:hover {
  color: var(--neo-ink);
}

.friend-pill-btn.active {
  background: var(--neo-surface);
  color: var(--neo-ink);
  border: 1px solid var(--neo-ink);
  box-shadow: 1.5px 1.5px 0px var(--neo-ink);
}

.pill-avatar {
  width: 18px;
  height: 18px;
  border-radius: 3px;
  border: 1px solid var(--neo-ink);
  image-rendering: pixelated;
}

.display-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.7rem;
  border-radius: var(--radius-xs);
  border: 1px solid transparent;
  background: transparent;
  color: var(--neo-ink-light);
  font-family: var(--font-family);
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
}

.display-btn.active {
  background: var(--neo-accent);
  color: var(--neo-ink);
  border: 1px solid var(--neo-ink);
  box-shadow: 1.5px 1.5px 0px var(--neo-ink);
}

.region-tabs-container {
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.region-tabs {
  display: flex;
  gap: 0.5rem;
  min-width: max-content;
}

.region-tab-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.55rem 1rem;
  border-radius: var(--radius-sm);
  background: var(--neo-surface);
  border: var(--neo-border);
  box-shadow: var(--elevation-1);
  cursor: pointer;
  transition: var(--transition);
}

.region-tab-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: var(--elevation-2);
}

.region-tab-btn.active {
  background: var(--neo-accent);
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0px var(--neo-ink);
}

.region-name {
  font-weight: 800;
  font-size: 0.9rem;
  color: var(--neo-ink);
}

.region-gen {
  font-size: 0.68rem;
  color: var(--neo-ink-muted);
  font-family: var(--font-mono);
  font-weight: 700;
  text-transform: uppercase;
}

.region-summary-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  gap: 1.5rem;
}

.summary-region-name {
  font-size: 1.35rem;
  font-weight: 900;
  color: var(--neo-ink);
  margin: 0.25rem 0 0.2rem;
}

.summary-desc {
  color: var(--neo-ink-light);
  font-size: 0.88rem;
}

.stat-badge-neo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-sm);
}

.circle-val {
  font-size: 1.6rem;
  font-weight: 900;
  color: var(--neo-ink);
  font-family: var(--font-mono);
}

.circle-lbl {
  font-size: 0.68rem;
  color: var(--neo-ink-muted);
  text-transform: uppercase;
  font-weight: 800;
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
  gap: 1.25rem;
}

.pokemon-card {
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: var(--transition);
}

.pokemon-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--elevation-3);
}

.pokemon-card.not-caught {
  background: var(--neo-bg-alt);
  opacity: 0.7;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.pkmn-number {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--neo-ink-light);
}

.sprite-box {
  width: 100%;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.6rem 0;
  border-radius: var(--radius-sm);
}

.pkmn-sprite {
  max-width: 70px;
  max-height: 70px;
  object-fit: contain;
}

.pkmn-sprite.silhouette {
  filter: brightness(0) opacity(0.35);
}

.card-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}

.pkmn-name {
  font-weight: 800;
  font-size: 0.92rem;
  color: var(--neo-ink);
}

.pkmn-status {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--neo-ink-muted);
}

.pagination-bar {
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  background: var(--neo-surface-card);
}

.page-info {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--neo-ink-muted);
}

.page-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-pills {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.page-pill {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-xs);
  border: var(--neo-border);
  background: var(--neo-bg);
  color: var(--neo-ink);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 1.5px 1.5px 0px var(--neo-ink);
  transition: transform 0.1s, box-shadow 0.1s;
}

.page-pill:hover {
  transform: translate(-1px, -1px);
  box-shadow: 2.5px 2.5px 0px var(--neo-ink);
}

.page-pill.active {
  background: var(--neo-accent);
  transform: translate(1px, 1px);
  box-shadow: 0px 0px 0px var(--neo-ink);
}
</style>
