<script setup>
import { Search, LayoutDashboard, Users, BookOpen, Sparkles, HardDriveDownload } from 'lucide-vue-next'

const props = defineProps({
  serverInfo: {
    type: Object,
    required: true
  },
  players: {
    type: Array,
    default: () => []
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

const emit = defineEmits(['update:searchQuery', 'changeTab', 'selectPlayer'])
</script>

<template>
  <aside class="sidebar">
    <!-- Topo: Logo PokeHub Neo-Skeuo -->
    <div class="sidebar-top">
      <div class="brand" @click="emit('changeTab', 'overview')">
        <div class="cube-icon">
          <div class="cube-top"></div>
          <div class="cube-bottom"></div>
          <div class="cube-center"></div>
        </div>
        <div class="brand-text">
          <span class="brand-title">PokeHub</span>
          <span class="brand-sub">Manual do Servidor</span>
        </div>
      </div>

      <!-- Campo de Busca Estilo Neo-Skeuo Text Field -->
      <div class="search-box">
        <Search :size="16" class="search-icon" />
        <input 
          type="text" 
          placeholder="Buscar amigo ou pokémon..."
          :value="searchQuery"
          @input="emit('update:searchQuery', $event.target.value)"
          class="neo-input search-input"
        />
      </div>
    </div>

    <!-- Navegação em Abas Táteis -->
    <nav class="sidebar-nav">
      <span class="nav-section-label">Navegação</span>

      <button 
        :class="['nav-item', { active: activeTab === 'overview' }]"
        @click="emit('changeTab', 'overview')"
      >
        <LayoutDashboard :size="18" />
        <span>Visão Geral</span>
      </button>

      <button 
        :class="['nav-item', { active: activeTab === 'leaderboard' }]"
        @click="emit('changeTab', 'leaderboard')"
      >
        <Users :size="18" />
        <span>Amigos & Equipes</span>
      </button>

      <button 
        :class="['nav-item', { active: activeTab === 'pokedex' }]"
        @click="emit('changeTab', 'pokedex')"
      >
        <BookOpen :size="18" />
        <span>Pokédex Regional</span>
      </button>

      <button 
        :class="['nav-item', { active: activeTab === 'trophies' }]"
        @click="emit('changeTab', 'trophies')"
      >
        <Sparkles :size="18" />
        <span>Lendários & Shinies</span>
      </button>

      <button 
        :class="['nav-item', { active: activeTab === 'backups' }]"
        @click="emit('changeTab', 'backups')"
      >
        <HardDriveDownload :size="18" />
        <span>Backups do Mapa</span>
      </button>
    </nav>

    <!-- Lista de Amigos no Servidor -->
    <div class="sidebar-friends" v-if="players.length">
      <div class="friends-header">
        <span class="nav-section-label">Treinadores</span>
        <span class="online-counter badge badge-online">
          {{ serverInfo.onlinePlayers }}/{{ serverInfo.totalPlayers }} Online
        </span>
      </div>

      <div class="mini-friends-list">
        <button 
          v-for="p in players" 
          :key="p.uuid" 
          class="mini-friend-btn"
          @click="emit('selectPlayer', p)"
          :title="'Ver equipe de ' + p.username"
        >
          <div class="mini-avatar-wrap">
            <img :src="p.avatar" :alt="p.username" class="mini-avatar" />
            <span class="mini-dot" :class="{ online: p.isOnline }"></span>
          </div>
          <div class="mini-friend-info">
            <span class="mini-friend-name">{{ p.username }}</span>
            <span class="mini-friend-meta">{{ p.totalCaptured }} capturados</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Rodapé da Sidebar: Status Tátil -->
    <div class="sidebar-footer">
      <div class="server-status-card neo-card-inset">
        <span class="status-dot"></span>
        <div class="status-details">
          <span class="status-title">Servidor Ativo</span>
          <span class="status-sub">{{ serverInfo.version }}</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 280px;
  height: 100vh;
  position: sticky;
  top: 0;
  background: var(--neo-bg);
  border-right: var(--neo-border);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.25rem;
  gap: 1.5rem;
  z-index: 50;
  flex-shrink: 0;
}

.sidebar-top {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
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
  flex-direction: column;
}

.brand-title {
  font-size: 1.65rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: var(--neo-ink);
  line-height: 1.1;
}

.brand-sub {
  font-size: 0.75rem;
  color: var(--neo-ink-muted);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* Cubic Pokéball Neo-Skeuo */
.cube-icon {
  width: 34px;
  height: 34px;
  position: relative;
  border-radius: var(--radius-xs);
  overflow: hidden;
  border: var(--neo-border);
  box-shadow: 2px 2px 0px var(--neo-ink);
  transform: rotate(-4deg);
  transition: var(--transition);
  flex-shrink: 0;
}

.brand:hover .cube-icon {
  transform: rotate(0deg) scale(1.08);
  box-shadow: 3px 3px 0px var(--neo-ink);
}

.cube-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: #ef4444;
  border-bottom: 1.5px solid var(--neo-ink);
}

.cube-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: #ffffff;
}

.cube-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: #ffffff;
  border: 2px solid var(--neo-ink);
  z-index: 2;
  box-shadow: 0 0 0 1px #ffffff;
}

/* Search Box Inset */
.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding-left: 2.2rem;
}

.search-input::placeholder {
  color: var(--neo-ink-muted);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  color: var(--neo-ink-light);
  pointer-events: none;
}

/* Navegação em Abas (Skeuo Tabs) */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-section-label {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--neo-ink-muted);
  padding: 0 0.35rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.65rem 0.9rem;
  border-radius: var(--radius-sm);
  background: var(--neo-surface);
  border: var(--neo-border);
  box-shadow: var(--elevation-1);
  color: var(--neo-ink);
  font-family: var(--font-family);
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  text-align: left;
}

.nav-item:hover {
  transform: translate(-1px, -1px);
  box-shadow: var(--elevation-2);
}

/* Estado Ativo: Efeito "Pressed Surface" */
.nav-item.active {
  background: #fef08a; /* Amarelo retrô / destaque */
  color: var(--neo-ink);
  box-shadow: 0px 0px 0px var(--neo-ink);
  transform: translate(2px, 2px);
}

/* Amigos na Sidebar */
.sidebar-friends {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex: 1;
  overflow-y: auto;
}

.friends-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.online-counter {
  font-size: 0.7rem;
}

.mini-friends-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.mini-friend-btn {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.45rem 0.65rem;
  border-radius: var(--radius-sm);
  background: var(--neo-surface);
  border: var(--neo-border-thin);
  box-shadow: 1px 1px 0px var(--neo-ink);
  cursor: pointer;
  transition: var(--transition);
  text-align: left;
}

.mini-friend-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: 2px 2px 0px var(--neo-ink);
}

.mini-friend-btn:active {
  transform: translate(1px, 1px);
  box-shadow: 0px 0px 0px var(--neo-ink);
}

.mini-avatar-wrap {
  position: relative;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.mini-avatar {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-xs);
  border: 1px solid var(--neo-ink);
  image-rendering: pixelated;
  background: var(--neo-bg-alt);
}

.mini-dot {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #a1a1aa;
  border: 1.5px solid var(--neo-ink);
}

.mini-dot.online {
  background: #10b981;
}

.mini-friend-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.mini-friend-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--neo-ink);
}

.mini-friend-meta {
  font-size: 0.72rem;
  color: var(--neo-ink-muted);
}

/* Sidebar Footer */
.sidebar-footer {
  padding-top: 0.75rem;
  border-top: var(--neo-border-thin);
}

.server-status-card {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 0.85rem;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
  border: 1.5px solid var(--neo-ink);
  box-shadow: 1px 1px 0px var(--neo-ink);
  flex-shrink: 0;
}

.status-details {
  display: flex;
  flex-direction: column;
}

.status-title {
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--neo-ink);
}

.status-sub {
  font-size: 0.72rem;
  color: var(--neo-ink-light);
}

@media (max-width: 900px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    border-right: none;
    border-bottom: var(--neo-border);
  }
  .sidebar-friends {
    display: none;
  }
  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
  }
}
</style>
