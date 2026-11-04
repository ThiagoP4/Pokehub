<script setup>
import { ref, computed } from 'vue'
import { regions, getPokemonSprite, getPokemonStaticSprite, typeColors } from '../data/mockData'
import { BookOpen, Sparkles, Filter, CheckCircle2 } from 'lucide-vue-next'

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

const activeRegion = computed(() => {
  return regions.find(r => r.id === selectedRegionId.value) || regions[0]
})

// Lista de Pokémons da região ativa
const regionPokemonList = computed(() => {
  const [start, end] = activeRegion.value.range
  const list = []

  // Pokémons capturados pelo jogador selecionado (ou AshKetchum como padrão)
  const player = props.selectedPlayer || props.players[0]
  const caughtSet = new Set(player.party.map(p => p.id))
  if (player.legendaries) {
    player.legendaries.forEach(l => caughtSet.add(l.id))
  }
  if (player.shiniesHighlights) {
    player.shiniesHighlights.forEach(s => caughtSet.add(s.id))
  }

  // Exemplos conhecidos de nomes para exibição rica
  const sampleNames = {
    1: "Bulbasaur", 2: "Ivysaur", 3: "Venusaur", 4: "Charmander", 5: "Charmeleon", 6: "Charizard",
    7: "Squirtle", 8: "Wartortle", 9: "Blastoise", 25: "Pikachu", 130: "Gyarados", 131: "Lapras",
    143: "Snorlax", 144: "Articuno", 145: "Zapdos", 146: "Moltres", 149: "Dragonite", 150: "Mewtwo", 151: "Mew",
    152: "Chikorita", 155: "Cyndaquil", 158: "Totodile", 243: "Raikou", 244: "Entei", 245: "Suicune", 249: "Lugia", 250: "Ho-Oh",
    252: "Treecko", 255: "Torchic", 258: "Mudkip", 382: "Kyogre", 383: "Groudon", 384: "Rayquaza",
    387: "Turtwig", 390: "Chimchar", 393: "Piplup", 445: "Garchomp", 448: "Lucario", 483: "Dialga", 484: "Palkia", 487: "Giratina", 493: "Arceus"
  }

  // Mostramos os primeiros 24 pokemons da região para renderização ágil e fluida
  const limit = Math.min(start + 23, end)
  for (let id = start; id <= limit; id++) {
    // Determina se foi capturado
    const isCaught = caughtSet.has(id) || (id % 2 === 0 && id <= start + 12)
    const isShiny = (id === 6 || id === 25 || id === 384 || id === 448) && isCaught
    const name = sampleNames[id] || `Pokémon #${String(id).padStart(3, '0')}`

    if (filterMode.value === 'caught' && !isCaught) continue
    if (filterMode.value === 'missing' && isCaught) continue

    list.push({
      id,
      number: `#${String(id).padStart(3, '0')}`,
      name,
      isCaught,
      isShiny,
      sprite: getPokemonSprite(id, isShiny),
      fallbackSprite: getPokemonStaticSprite(id, isShiny)
    })
  }

  return list
})
</script>

<template>
  <section class="pokedex-section" id="pokedex">
    <div class="container">
      <div class="section-header">
        <div>
          <div class="pokedex-title-badge">
            <BookOpen :size="16" />
            <span>Enciclopédia Cobblemon</span>
          </div>
          <h2 class="section-title">Pokédex por Região</h2>
          <p class="section-subtitle">
            Progresso de exploração do mundo Cobblemon baseado no jogador 
            <strong class="highlight-player">{{ (selectedPlayer || players[0]).username }}</strong>
          </p>
        </div>

        <!-- Filter mode -->
        <div class="display-filters">
          <button 
            :class="['display-btn', { active: filterMode === 'all' }]"
            @click="filterMode = 'all'"
          >
            Todos
          </button>
          <button 
            :class="['display-btn', { active: filterMode === 'caught' }]"
            @click="filterMode = 'caught'"
          >
            <CheckCircle2 :size="14" />
            Capturados
          </button>
          <button 
            :class="['display-btn', { active: filterMode === 'missing' }]"
            @click="filterMode = 'missing'"
          >
            Faltando
          </button>
        </div>
      </div>

      <!-- Region Selector Tabs -->
      <div class="region-tabs-container">
        <div class="region-tabs">
          <button 
            v-for="region in regions" 
            :key="region.id"
            :class="['region-tab-btn', { active: selectedRegionId === region.id }]"
            @click="selectedRegionId = region.id"
          >
            <span class="region-name">{{ region.name }}</span>
            <span class="region-gen">{{ region.gen }}</span>
          </button>
        </div>
      </div>

      <!-- Region Banner & Progress Summary -->
      <div class="region-summary-card glass-panel">
        <div class="summary-info">
          <span class="summary-gen-tag">{{ activeRegion.gen }}</span>
          <h3 class="summary-region-name">Região de {{ activeRegion.name }}</h3>
          <p class="summary-desc">
            Registros {{ activeRegion.range[0] }} até {{ activeRegion.range[1] }} • Total de {{ activeRegion.total }} espécies nativas no Cobblemon.
          </p>
        </div>

        <div class="summary-stats">
          <div class="stat-circle">
            <span class="circle-val">84%</span>
            <span class="circle-lbl">Conclusão</span>
          </div>
        </div>
      </div>

      <!-- Pokemon Grid -->
      <div class="pokemon-grid">
        <div 
          v-for="pkmn in regionPokemonList" 
          :key="pkmn.id"
          class="pokemon-card glass-panel"
          :class="{ 'not-caught': !pkmn.isCaught, 'is-shiny': pkmn.isShiny }"
        >
          <div class="card-header">
            <span class="pkmn-number">{{ pkmn.number }}</span>
            <span v-if="pkmn.isShiny" class="badge-mini-shiny" title="Versão Brilhante">
              ✨ Shiny
            </span>
            <span v-else-if="pkmn.isCaught" class="badge-mini-caught" title="Capturado">
              ✓ Pegou
            </span>
          </div>

          <!-- Sprite with Fallback -->
          <div class="sprite-box">
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
            <span class="pkmn-status">{{ pkmn.isCaught ? 'Registrado' : 'Desconhecido' }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pokedex-section {
  padding: 3rem 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.pokedex-title-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent-cyan);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.4rem;
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

.highlight-player {
  color: #38bdf8;
}

.display-filters {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.3rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  gap: 0.25rem;
}

.display-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.85rem;
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

.display-btn.active {
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
}

/* Region Tabs */
.region-tabs-container {
  overflow-x: auto;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
}

.region-tabs {
  display: flex;
  gap: 0.6rem;
  min-width: max-content;
}

.region-tab-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.65rem 1.25rem;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--glass-border);
  cursor: pointer;
  transition: var(--transition);
}

.region-tab-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.region-tab-btn.active {
  background: linear-gradient(135deg, rgba(2, 132, 199, 0.3), rgba(56, 189, 248, 0.3));
  border-color: var(--accent-cyan);
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.25);
}

.region-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
}

.region-gen {
  font-size: 0.7rem;
  color: var(--text-dim);
  text-transform: uppercase;
}

/* Region Summary Card */
.region-summary-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, rgba(14, 27, 61, 0.8), rgba(2, 132, 199, 0.15));
}

.summary-gen-tag {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent-cyan);
  text-transform: uppercase;
}

.summary-region-name {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
}

.summary-desc {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.stat-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid var(--accent-cyan);
  background: rgba(10, 17, 40, 0.6);
  box-shadow: 0 0 15px rgba(34, 211, 238, 0.3);
}

.circle-val {
  font-size: 1.3rem;
  font-weight: 800;
  color: #ffffff;
}

.circle-lbl {
  font-size: 0.65rem;
  color: var(--text-dim);
  text-transform: uppercase;
}

/* Pokemon Grid */
.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 1.25rem;
}

.pokemon-card {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  transition: var(--transition);
}

.pokemon-card:hover {
  transform: translateY(-4px);
  border-color: rgba(56, 189, 248, 0.5);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
}

.pokemon-card.is-shiny {
  border-color: rgba(250, 204, 21, 0.4);
  background: rgba(250, 204, 21, 0.04);
}

.pokemon-card.not-caught {
  opacity: 0.55;
  filter: grayscale(0.85);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 0.5rem;
}

.pkmn-number {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-dim);
}

.badge-mini-shiny {
  font-size: 0.65rem;
  font-weight: 700;
  color: #fde047;
  background: rgba(250, 204, 21, 0.2);
  padding: 0.15rem 0.4rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(250, 204, 21, 0.3);
}

.badge-mini-caught {
  font-size: 0.65rem;
  font-weight: 700;
  color: #34d399;
  background: rgba(16, 185, 129, 0.2);
  padding: 0.15rem 0.4rem;
  border-radius: var(--radius-sm);
}

.sprite-box {
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.5rem 0;
}

.pkmn-sprite {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}

.pkmn-sprite.silhouette {
  filter: brightness(0) invert(0.2) opacity(0.5);
}

.card-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}

.pkmn-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: #ffffff;
}

.pkmn-status {
  font-size: 0.7rem;
  color: var(--text-dim);
}
</style>
