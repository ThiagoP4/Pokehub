<script setup>
import { ref } from 'vue'
import { Copy, Check, Sparkles, Compass, ShieldCheck } from 'lucide-vue-next'
import { getPokemonSprite } from '../data/mockData'

const props = defineProps({
  serverInfo: {
    type: Object,
    required: true
  }
})

const copied = ref(false)

function copyServerIp() {
  navigator.clipboard.writeText(props.serverInfo.ip)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2200)
}
</script>

<template>
  <section class="hero-section">
    <!-- Background Scenery (Sky, Ocean, Clouds) -->
    <div class="hero-scenery">
      <div class="sky-gradient"></div>
      <div class="sun-glow"></div>
      
      <!-- Pixel / Voxel Clouds -->
      <div class="clouds-layer">
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="cloud cloud-3"></div>
      </div>

      <!-- Ocean with waves -->
      <div class="ocean-layer">
        <div class="ocean-water"></div>
        <div class="wave wave-1"></div>
        <div class="wave wave-2"></div>
      </div>

      <!-- Cobblemon Lapras swimming like in the screenshot! -->
      <div class="lapras-swimmer">
        <img 
          :src="getPokemonSprite(131)" 
          alt="Lapras Nadando" 
          class="lapras-sprite"
        />
        <div class="water-ripple"></div>
      </div>

      <!-- Small companion Magikarp/Pikachu on the side -->
      <div class="magikarp-splash">
        <img :src="getPokemonSprite(129, true)" alt="Magikarp Dourado" class="magikarp-sprite" />
      </div>
    </div>

    <!-- Hero Content Overlay -->
    <div class="container hero-content-container">
      <div class="hero-content">
        <div class="hero-tag">
          <Sparkles :size="14" class="tag-icon" />
          <span>{{ serverInfo.version }}</span>
        </div>

        <h1 class="hero-title">
          O Painel Definitivo do <span class="highlight-text">{{ serverInfo.name }}</span>
        </h1>

        <p class="hero-subtitle">
          {{ serverInfo.motd }} Acompanhe a Pokédex de cada região, coleção de lendários, caçadores de shinies e o progresso em tempo real de cada treinador.
        </p>

        <!-- Call to actions -->
        <div class="hero-actions">
          <button class="btn btn-primary ip-copy-btn" @click="copyServerIp">
            <span class="btn-label">Copiar IP do Servidor</span>
            <span class="btn-ip">{{ serverInfo.ip }}</span>
            <component :is="copied ? Check : Copy" :size="18" />
          </button>

          <a href="#rankings" class="btn btn-secondary">
            <Compass :size="18" />
            <span>Explorar Rankings</span>
          </a>
        </div>

        <!-- Quick badges -->
        <div class="hero-badges">
          <div class="hero-stat-badge">
            <ShieldCheck :size="16" class="stat-icon" />
            <span><strong>{{ serverInfo.onlinePlayers }} / {{ serverInfo.maxPlayers }}</strong> Jogando Agora</span>
          </div>
          <div class="hero-stat-badge">
            <Sparkles :size="16" class="stat-icon shiny-icon" />
            <span><strong>9 Regiões</strong> Habilitadas</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Smooth Bottom Wave Divider to Content -->
    <div class="bottom-divider">
      <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M0,32L60,42.7C120,53,240,75,360,80C480,85,600,75,720,64C840,53,960,43,1080,48C1200,53,1320,75,1380,85.3L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" fill="#0a1128"></path>
      </svg>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  min-height: 520px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

/* Background Scenery: Sky and Ocean */
.hero-scenery {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.sky-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(180deg, #1e3a8a 0%, #0284c7 60%, #38bdf8 100%);
}

.sun-glow {
  position: absolute;
  top: 20%;
  left: 65%;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(254, 240, 138, 0.25) 0%, rgba(56, 189, 248, 0) 70%);
  filter: blur(40px);
}

/* Clouds */
.clouds-layer {
  position: absolute;
  top: 15%;
  left: 0;
  right: 0;
  height: 120px;
}

.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(4px);
  border-radius: 50px;
}

.cloud-1 {
  width: 180px;
  height: 40px;
  top: 10px;
  left: 10%;
  box-shadow: 20px -15px 0 10px rgba(255, 255, 255, 0.35);
  animation: float 8s ease-in-out infinite;
}

.cloud-2 {
  width: 240px;
  height: 50px;
  top: 30px;
  right: 15%;
  box-shadow: 30px -20px 0 15px rgba(255, 255, 255, 0.3);
  animation: float 10s ease-in-out infinite reverse;
}

.cloud-3 {
  width: 140px;
  height: 35px;
  top: 60px;
  left: 45%;
  box-shadow: 15px -10px 0 8px rgba(255, 255, 255, 0.2);
  animation: float 7s ease-in-out infinite;
}

/* Ocean Layer */
.ocean-layer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48%;
  background: linear-gradient(180deg, #0284c7 0%, #0369a1 40%, #0c4a6e 100%);
  overflow: hidden;
}

.wave {
  position: absolute;
  top: -15px;
  left: 0;
  right: 0;
  height: 30px;
  background-image: radial-gradient(circle at 50% -10px, transparent 20px, rgba(255, 255, 255, 0.25) 21px, transparent 24px);
  background-size: 60px 40px;
}

.wave-2 {
  top: -5px;
  opacity: 0.5;
  background-size: 80px 40px;
}

/* Lapras swimming like in the screenshot! */
.lapras-swimmer {
  position: absolute;
  right: 10%;
  bottom: 12%;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: float 5s ease-in-out infinite;
}

.lapras-sprite {
  width: 160px;
  height: 160px;
  object-fit: contain;
  filter: drop-shadow(0 15px 15px rgba(0, 0, 0, 0.4));
  transform: scaleX(-1); /* Olhando para a esquerda */
}

.water-ripple {
  width: 120px;
  height: 14px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  margin-top: -20px;
  filter: blur(2px);
  animation: pulseGlow 3s infinite;
}

.magikarp-splash {
  position: absolute;
  right: 26%;
  bottom: 8%;
  z-index: 2;
  animation: float 3s ease-in-out infinite reverse;
}

.magikarp-sprite {
  width: 70px;
  height: 70px;
  object-fit: contain;
  filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.3));
}

/* Hero Content */
.hero-content-container {
  position: relative;
  z-index: 5;
  padding-top: 3.5rem;
  padding-bottom: 4.5rem;
}

.hero-content {
  max-width: 680px;
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-full);
  background: rgba(10, 17, 40, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--accent-cyan);
  margin-bottom: 1.25rem;
}

.tag-icon {
  color: var(--accent-cyan);
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: #ffffff;
  margin-bottom: 1rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.highlight-text {
  background: linear-gradient(135deg, #ffffff 0%, #bae6fd 60%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #e2e8f0;
  margin-bottom: 2rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.ip-copy-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem 1.4rem;
}

.btn-label {
  font-size: 0.85rem;
  opacity: 0.85;
}

.btn-ip {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.95rem;
  background: rgba(0, 0, 0, 0.25);
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-badges {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-stat-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #f1f5f9;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);
  padding: 0.4rem 0.9rem;
  border-radius: var(--radius-full);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-icon {
  color: #38bdf8;
}

.shiny-icon {
  color: #facc15;
}

/* Bottom Divider */
.bottom-divider {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 4;
  line-height: 0;
}

.bottom-divider svg {
  display: block;
  width: 100%;
  height: 50px;
}

@media (max-width: 900px) {
  .hero-title {
    font-size: 2.2rem;
  }
  .lapras-swimmer {
    opacity: 0.35;
    right: -20px;
  }
}
</style>
