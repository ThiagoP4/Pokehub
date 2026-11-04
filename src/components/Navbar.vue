<script setup>
import { ref } from 'vue'
import { Search, Trophy, BookOpen, Users, Sparkles, Copy, Check } from 'lucide-vue-next'

const props = defineProps({
  serverInfo: {
    type: Object,
    required: true
  },
  searchQuery: {
    type: String,
    default: ''
  },
  activeTab: {
    type: String,
    default: 'overview'
  }
})

const emit = defineEmits(['update:searchQuery', 'changeTab'])

const copied = ref(false)

function copyIp() {
  navigator.clipboard.writeText(props.serverInfo.ip)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <header class="navbar">
    <div class="container navbar-container">
      <!-- Logo Cobblemon Style -->
      <div class="brand" @click="emit('changeTab', 'overview')">
        <div class="cube-icon">
          <div class="cube-top"></div>
          <div class="cube-bottom"></div>
          <div class="cube-center"></div>
        </div>
        <div class="brand-text">
          <span class="brand-title">cobblemon</span>
          <span class="brand-badge">POKEHUB</span>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="nav-links">
        <button 
          :class="['nav-link', { active: activeTab === 'overview' }]"
          @click="emit('changeTab', 'overview')"
        >
          <Sparkles :size="18" />
          <span>Visão Geral</span>
        </button>

        <button 
          :class="['nav-link', { active: activeTab === 'leaderboard' }]"
          @click="emit('changeTab', 'leaderboard')"
        >
          <Trophy :size="18" />
          <span>Rankings</span>
        </button>

        <button 
          :class="['nav-link', { active: activeTab === 'pokedex' }]"
          @click="emit('changeTab', 'pokedex')"
        >
          <BookOpen :size="18" />
          <span>Pokédex</span>
        </button>

        <button 
          :class="['nav-link', { active: activeTab === 'players' }]"
          @click="emit('changeTab', 'players')"
        >
          <Users :size="18" />
          <span>Treinadores</span>
        </button>
      </nav>

      <!-- Right Actions: Search & Server IP -->
      <div class="nav-actions">
        <div class="search-box">
          <Search :size="16" class="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar treinador..."
            :value="searchQuery"
            @input="emit('update:searchQuery', $event.target.value)"
          />
        </div>

        <button class="server-ip-pill" @click="copyIp" :title="'Clique para copiar o IP: ' + serverInfo.ip">
          <span class="status-dot"></span>
          <span class="ip-text">{{ serverInfo.onlinePlayers }} Online</span>
          <component :is="copied ? Check : Copy" :size="14" class="copy-icon" :class="{ copied }" />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(10, 17, 40, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--glass-border);
  height: 74px;
  display: flex;
  align-items: center;
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  width: 100%;
}

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  cursor: pointer;
  user-select: none;
}

.brand-text {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}

.brand-title {
  font-size: 1.55rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #ffffff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

.brand-badge {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--accent-ocean), var(--accent-cyan));
  color: #ffffff;
}

/* Cubic Cobblemon Pokéball */
.cube-icon {
  width: 28px;
  height: 28px;
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.4), inset 0 0 0 1.5px rgba(0,0,0,0.5);
  transform: rotate(-6deg);
  transition: transform 0.3s ease;
}

.brand:hover .cube-icon {
  transform: rotate(0deg) scale(1.1);
}

.cube-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, #ef4444 0%, #b91c1c 100%);
}

.cube-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%);
}

.cube-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 9px;
  height: 9px;
  border-radius: 2px;
  background: #ffffff;
  border: 2px solid #0f172a;
  box-shadow: 0 0 4px rgba(0,0,0,0.4);
  z-index: 2;
}

/* Nav links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(255, 255, 255, 0.04);
  padding: 0.3rem 0.4rem;
  border-radius: var(--radius-full);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-family: var(--font-family);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.nav-link:hover {
  color: var(--text-main);
  background: rgba(255, 255, 255, 0.06);
}

.nav-link.active {
  color: #ffffff;
  background: rgba(56, 189, 248, 0.15);
  border: 1px solid rgba(56, 189, 248, 0.3);
  font-weight: 600;
}

/* Search and Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  padding: 0.5rem 1rem 0.5rem 2.2rem;
  border-radius: var(--radius-full);
  color: var(--text-main);
  font-family: var(--font-family);
  font-size: 0.85rem;
  width: 170px;
  transition: var(--transition);
}

.search-box input:focus {
  outline: none;
  width: 220px;
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--accent-cyan);
  box-shadow: 0 0 15px rgba(34, 211, 238, 0.2);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  color: var(--text-dim);
  pointer-events: none;
}

.server-ip-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #34d399;
  padding: 0.5rem 0.9rem;
  border-radius: var(--radius-full);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.server-ip-pill:hover {
  background: rgba(16, 185, 129, 0.2);
  border-color: #34d399;
  transform: translateY(-1px);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #10b981;
  box-shadow: 0 0 8px #10b981;
  animation: pulseGlow 2s infinite;
}

.copy-icon {
  color: var(--text-dim);
  transition: var(--transition);
}

.copy-icon.copied {
  color: #34d399;
}

@media (max-width: 900px) {
  .nav-links {
    display: none;
  }
}
</style>
