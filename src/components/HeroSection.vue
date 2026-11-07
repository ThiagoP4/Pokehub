<script setup>
import { computed } from 'vue'
import { Sparkles, Flame, Trophy } from 'lucide-vue-next'
import { getPokemonSprite } from '../data/mockData'

const props = defineProps({
  serverInfo: {
    type: Object,
    required: true
  },
  players: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['selectPlayer'])

// Treinadores registrados no servidor
const activeTrainers = computed(() => {
  const online = props.players.filter(p => p.isOnline)
  return online.length > 0 ? online : props.players.slice(0, 5)
})

const hasOnlineNow = computed(() => {
  return props.players.some(p => p.isOnline)
})

// Líder real da Pokédex de Kanto
const kantoLeader = computed(() => {
  if (!props.players.length) return null
  return [...props.players].sort(
    (a, b) => (b.pokedexProgress?.kanto?.caught || 0) - (a.pokedexProgress?.kanto?.caught || 0)
  )[0]
})

const bestKantoCaught = computed(() => {
  return kantoLeader.value?.pokedexProgress?.kanto?.caught || 0
})

const kantoPercent = computed(() => {
  return Math.round((bestKantoCaught.value / 151) * 100)
})

// Destaque real de Shiny entre os jogadores do servidor
const featuredShiny = computed(() => {
  for (const p of props.players) {
    if (Array.isArray(p.shiniesHighlights) && p.shiniesHighlights.length > 0) {
      const topShiny = [...p.shiniesHighlights].sort((a, b) => (b.level || 0) - (a.level || 0))[0]
      return { player: p, pokemon: topShiny }
    }
  }
  return null
})

// Destaque real de Lendário ou Pokémon de maior nível no servidor
const featuredPower = computed(() => {
  for (const p of props.players) {
    if (Array.isArray(p.legendaries) && p.legendaries.length > 0) {
      const topLeg = [...p.legendaries].sort((a, b) => (b.level || 0) - (a.level || 0))[0]
      return { player: p, pokemon: topLeg, isLegendary: true }
    }
  }
  // Se ainda não houver lendário, mostra o Pokémon de maior nível entre todas as equipes reais
  let best = null
  for (const p of props.players) {
    for (const poke of p.party || []) {
      if (!best || (poke.level || 0) > (best.pokemon.level || 0)) {
        best = { player: p, pokemon: poke, isLegendary: false }
      }
    }
  }
  return best
})
</script>

<template>
  <div class="neo-hero-header">
    <!-- Céu Estrelado Contínuo + Arte do Charizard -->
    <div class="hero-image-wrap">
      <img src="/hero-bg.jpg" alt="Charizard Cobblemon Voando" class="hero-bg-art" />
    </div>

    <!-- Composição Rica na Esquerda 100% com Dados Reais do Servidor -->
    <div class="hero-direct-content">
      <!-- 1. Pílula de Treinadores do Servidor -->
      <div class="online-now-pill" v-if="players.length">
        <span class="pulse-dot"></span>
        <span class="online-pill-text">
          {{ hasOnlineNow ? `${activeTrainers.length} jogando agora:` : `${players.length} treinadores no servidor:` }}
        </span>
        <div class="online-avatars">
          <img 
            v-for="friend in activeTrainers" 
            :key="friend.uuid" 
            :src="friend.avatar" 
            :alt="friend.username"
            :title="friend.username"
            class="mini-head"
            @click="emit('selectPlayer', friend)"
          />
        </div>
      </div>

      <!-- 2. Título Principal com Progresso Real de Kanto -->
      <h1 class="hero-title">
        Meta Kanto: {{ bestKantoCaught }} / 151
      </h1>

      <!-- 3. Barra de Progresso Neo-Skeuo da Meta do Servidor -->
      <div class="server-goal-box">
        <div class="goal-labels">
          <span>
            Progresso da Pokédex de Kanto
            <template v-if="kantoLeader">(Líder: {{ kantoLeader.username }})</template>
          </span>
          <strong>{{ kantoPercent }}%</strong>
        </div>
        <div class="goal-track">
          <div class="goal-fill" :style="{ width: kantoPercent + '%' }"></div>
        </div>
      </div>

      <!-- 4. Cards Táteis Dinâmicos baseados nos Pokémon Reais do Servidor -->
      <div class="recent-catch-Group">
        <div 
          v-if="featuredShiny" 
          class="recent-catch-card" 
          @click="emit('selectPlayer', featuredShiny.player)"
        >
          <div class="rc-sprite-box">
            <img :src="getPokemonSprite(featuredShiny.pokemon.id, true)" :alt="featuredShiny.pokemon.name" class="rc-sprite" />
          </div>
          <div class="rc-info">
            <span class="rc-tag">
              <Sparkles :size="12" />
              Destaque Shiny
            </span>
            <span class="rc-desc">
              <strong>{{ featuredShiny.player.username }}</strong> tem <strong>Shiny {{ featuredShiny.pokemon.name }}</strong> (Lv. {{ featuredShiny.pokemon.level }})
            </span>
          </div>
        </div>

        <div 
          v-if="featuredPower" 
          class="recent-catch-card" 
          @click="emit('selectPlayer', featuredPower.player)"
        >
          <div class="rc-sprite-box legendary-bg">
            <img :src="getPokemonSprite(featuredPower.pokemon.id, featuredPower.pokemon.shiny)" :alt="featuredPower.pokemon.name" class="rc-sprite" />
          </div>
          <div class="rc-info">
            <span class="rc-tag legendary-tag">
              <Flame v-if="featuredPower.isLegendary" :size="12" />
              <Trophy v-else :size="12" />
              {{ featuredPower.isLegendary ? 'Lendário no Servidor' : 'Maior Nível na Party' }}
            </span>
            <span class="rc-desc">
              <strong>{{ featuredPower.player.username }}</strong> com <strong>{{ featuredPower.pokemon.name }}</strong> (Lv. {{ featuredPower.pokemon.level }})
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.neo-hero-header {
  position: relative;
  min-height: 420px;
  display: flex;
  align-items: center;
  margin: -2rem -2.5rem 0 -2.5rem;
  padding: 2.25rem 3rem 5rem 3rem;
  border-bottom: var(--neo-border-thick);
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #080e24 0%,
    #0d1d42 48%,
    #19618a 82%,
    #259cb8 100%
  );
}

.hero-image-wrap {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
  pointer-events: none;
}

.hero-bg-art {
  height: 100%;
  width: auto;
  min-width: 68%;
  object-fit: cover;
  object-position: right center;
  display: block;
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 28%);
  mask-image: linear-gradient(to right, transparent 0%, black 28%);
}

.hero-direct-content {
  position: relative;
  z-index: 2;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.online-now-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.3rem 0.75rem;
  background: #fef08a;
  color: var(--neo-ink);
  border: var(--neo-border);
  border-radius: var(--radius-xs);
  box-shadow: 2px 2px 0px var(--neo-ink);
  margin-bottom: 0.9rem;
}

.pulse-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #10b981;
  border: 1.5px solid var(--neo-ink);
}

.online-pill-text {
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.online-avatars {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.mini-head {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  border: 1.5px solid var(--neo-ink);
  image-rendering: pixelated;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.mini-head:hover {
  transform: scale(1.15);
}

.hero-title {
  font-size: 2.55rem;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: -0.03em;
  line-height: 1.12;
  margin-bottom: 0.85rem;
  text-shadow: 3px 3px 0px var(--neo-ink);
}

.server-goal-box {
  width: 100%;
  max-width: 470px;
  margin-bottom: 1.25rem;
}

.goal-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 0.4rem;
  text-shadow: 1.5px 1.5px 0px var(--neo-ink);
}

.goal-labels strong {
  color: #fef08a;
  font-family: var(--font-mono);
}

.goal-track {
  width: 100%;
  height: 14px;
  background: rgba(15, 23, 42, 0.75);
  border: var(--neo-border);
  border-radius: var(--radius-full);
  box-shadow: 2px 2px 0px var(--neo-ink);
  overflow: hidden;
  padding: 2px;
}

.goal-fill {
  height: 100%;
  background: linear-gradient(90deg, #facc15, #f97316);
  border-radius: var(--radius-full);
  border-right: 2px solid var(--neo-ink);
}

.recent-catch-Group {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.recent-catch-card {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  background: var(--neo-surface);
  border: var(--neo-border);
  box-shadow: 3px 3px 0px var(--neo-ink);
  border-radius: var(--radius-sm);
  padding: 0.5rem 0.85rem 0.5rem 0.55rem;
  cursor: pointer;
  transition: var(--transition);
}

.recent-catch-card:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0px var(--neo-ink);
}

.rc-sprite-box {
  width: 42px;
  height: 42px;
  background: #fef9c3;
  border: 1.5px solid var(--neo-ink);
  border-radius: var(--radius-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.rc-sprite-box.legendary-bg {
  background: #f3e8ff;
}

.rc-sprite {
  max-width: 36px;
  max-height: 36px;
  object-fit: contain;
}

.rc-info {
  display: flex;
  flex-direction: column;
}

.rc-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #b45309;
}

.rc-tag.legendary-tag {
  color: #6b21a8;
}

.rc-desc {
  font-size: 0.8rem;
  color: var(--neo-ink);
  font-weight: 600;
}

@media (max-width: 900px) {
  .neo-hero-header {
    margin: -1.25rem -1.25rem 0 -1.25rem;
    padding: 2rem 1.5rem 4rem 1.5rem;
    min-height: 340px;
  }
  .hero-title {
    font-size: 2rem;
  }
}
</style>
