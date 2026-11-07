<script setup>
import { computed } from 'vue'
import { Sparkles, Flame } from 'lucide-vue-next'
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

// Amigos que estão online neste momento
const onlineFriends = computed(() => {
  return props.players.filter(p => p.isOnline)
})

// Progresso coletivo da Pokédex de Kanto (exemplo de meta do grupo)
const bestKantoCaught = computed(() => {
  if (!props.players.length) return 0
  return Math.max(...props.players.map(p => p.pokedexProgress?.kanto?.caught || 0))
})

const kantoPercent = computed(() => {
  return Math.round((bestKantoCaught.value / 151) * 100)
})
</script>

<template>
  <div class="neo-hero-header">
    <!-- Céu Estrelado Contínuo + Arte do Charizard -->
    <div class="hero-image-wrap">
      <img src="/hero-bg.jpg" alt="Charizard Cobblemon Voando" class="hero-bg-art" />
    </div>

    <!-- Composição Rica na Esquerda, mas 100% com Dados Reais do Servidor -->
    <div class="hero-direct-content">
      <!-- 1. Pílula de Quem Está Jogando Agora (com as cabeças das skins) -->
      <div class="online-now-pill">
        <span class="pulse-dot"></span>
        <span class="online-pill-text">{{ onlineFriends.length }} jogando agora:</span>
        <div class="online-avatars">
          <img 
            v-for="friend in onlineFriends" 
            :key="friend.uuid" 
            :src="friend.avatar" 
            :alt="friend.username"
            :title="friend.username + ' está online'"
            class="mini-head"
            @click="emit('selectPlayer', friend)"
          />
        </div>
      </div>

      <!-- 2. Título Principal com Progresso Coletivo -->
      <h1 class="hero-title">
        Meta Kanto: {{ bestKantoCaught }} / 151
      </h1>

      <!-- 3. Barra de Progresso Neo-Skeuo da Meta do Servidor -->
      <div class="server-goal-box">
        <div class="goal-labels">
          <span>Progresso da Pokédex de Kanto (Líder: Thiago)</span>
          <strong>{{ kantoPercent }}%</strong>
        </div>
        <div class="goal-track">
          <div class="goal-fill" :style="{ width: kantoPercent + '%' }"></div>
        </div>
      </div>

      <!-- 4. Card Tátil de "Última Captura Rara" no lugar dos botões repetidos -->
      <div class="recent-catch-Group">
        <div class="recent-catch-card" @click="emit('selectPlayer', players[1])">
          <div class="rc-sprite-box">
            <img :src="getPokemonSprite(384, true)" alt="Shiny Rayquaza" class="rc-sprite" />
          </div>
          <div class="rc-info">
            <span class="rc-tag">
              <Sparkles :size="12" />
              Último Shiny Descoberto
            </span>
            <span class="rc-desc"><strong>Alisson</strong> capturou <strong>Shiny Rayquaza</strong> (Lv. 85)</span>
          </div>
        </div>

        <div class="recent-catch-card" @click="emit('selectPlayer', players[2])">
          <div class="rc-sprite-box legendary-bg">
            <img :src="getPokemonSprite(483, false)" alt="Dialga" class="rc-sprite" />
          </div>
          <div class="rc-info">
            <span class="rc-tag legendary-tag">
              <Flame :size="12" />
              Último Lendário
            </span>
            <span class="rc-desc"><strong>Iorran</strong> capturou <strong>Dialga</strong> (Lv. 80)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Cabeçalho integrado de ponta a ponta no topo do painel */
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

/* Coluna da esquerda com peso visual equilibrado */
.hero-direct-content {
  position: relative;
  z-index: 2;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* 1. Pílula Online Agora */
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

/* 2. Título Principal */
.hero-title {
  font-size: 2.55rem;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: -0.03em;
  line-height: 1.12;
  margin-bottom: 0.85rem;
  text-shadow: 3px 3px 0px var(--neo-ink);
}

/* 3. Barra de Progresso da Meta */
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

/* 4. Pílulas de Últimas Capturas Raras (Feed de Atividade) */
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
