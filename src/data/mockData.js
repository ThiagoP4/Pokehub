// Dados simulados realistas de jogadores do Cobblemon
export const serverInfo = {
  name: "Cobblemon Brasil Odyssey",
  motd: "O maior mundo aberto de Cobblemon do Brasil! Explore, batalhe e capture.",
  ip: "jogar.cobblemonbrasil.com",
  version: "Minecraft 1.20.1 • Cobblemon 1.5.2",
  onlinePlayers: 18,
  maxPlayers: 50,
  uptime: "99.8%",
  totalRegistered: 142
}

export const regions = [
  { id: 'kanto', name: 'Kanto', gen: 'Gen 1', range: [1, 151], total: 151, color: '#ff4d4d' },
  { id: 'johto', name: 'Johto', gen: 'Gen 2', range: [152, 251], total: 100, color: '#f7b731' },
  { id: 'hoenn', name: 'Hoenn', gen: 'Gen 3', range: [252, 386], total: 135, color: '#26de81' },
  { id: 'sinnoh', name: 'Sinnoh', gen: 'Gen 4', range: [387, 493], total: 107, color: '#45aaf2' },
  { id: 'unova', name: 'Unova', gen: 'Gen 5', range: [494, 649], total: 156, color: '#4b6584' },
  { id: 'kalos', name: 'Kalos', gen: 'Gen 6', range: [650, 721], total: 72, color: '#fd9644' },
  { id: 'alola', name: 'Alola', gen: 'Gen 7', range: [722, 809], total: 88, color: '#a55eea' },
  { id: 'galar', name: 'Galar', gen: 'Gen 8', range: [810, 905], total: 96, color: '#2bcbba' },
  { id: 'paldea', name: 'Paldea', gen: 'Gen 9', range: [906, 1025], total: 120, color: '#eb3b5a' }
]

export const playersData = [
  {
    uuid: "a8e9-41fa-8812-9cbb",
    username: "AshKetchum_BR",
    avatar: "https://mc-heads.net/avatar/AshKetchum_BR/100",
    rank: "Mestre Pokémon",
    isOnline: true,
    playTime: "148h",
    totalCaptured: 342,
    shiniesCount: 14,
    legendariesCount: 4,
    pokedexProgress: {
      kanto: { seen: 151, caught: 142 },
      johto: { seen: 98, caught: 85 },
      hoenn: { seen: 120, caught: 92 },
      sinnoh: { seen: 70, caught: 54 },
      unova: { seen: 60, caught: 41 },
      kalos: { seen: 45, caught: 38 },
      alola: { seen: 50, caught: 35 },
      galar: { seen: 40, caught: 29 },
      paldea: { seen: 30, caught: 20 }
    },
    party: [
      { id: 25, name: "Pikachu", level: 88, shiny: false, gender: "M", nature: "Jolly", ability: "Static", item: "Light Ball", types: ["Electric"], ivPercent: 92 },
      { id: 6, name: "Charizard", level: 92, shiny: true, gender: "M", nature: "Timid", ability: "Solar Power", item: "Choice Specs", types: ["Fire", "Flying"], ivPercent: 97 },
      { id: 131, name: "Lapras", level: 75, shiny: false, gender: "F", nature: "Modest", ability: "Water Absorb", item: "Leftovers", types: ["Water", "Ice"], ivPercent: 88 },
      { id: 143, name: "Snorlax", level: 80, shiny: false, gender: "M", nature: "Careful", ability: "Thick Fat", item: "Chesto Berry", types: ["Normal"], ivPercent: 85 },
      { id: 150, name: "Mewtwo", level: 95, shiny: false, isLegendary: true, gender: "N", nature: "Timid", ability: "Pressure", item: "Life Orb", types: ["Psychic"], ivPercent: 95 },
      { id: 448, name: "Lucario", level: 86, shiny: true, gender: "M", nature: "Adamant", ability: "Justified", item: "Focus Sash", types: ["Fighting", "Steel"], ivPercent: 94 }
    ],
    legendaries: [
      { id: 150, name: "Mewtwo", level: 95, shiny: false, caughtAt: "Cerulean Cave (Bioma Deep Dark)" },
      { id: 144, name: "Articuno", level: 70, shiny: false, caughtAt: "Picos Congelados" },
      { id: 249, name: "Lugia", level: 80, shiny: false, caughtAt: "Monumento Oceânico Profundo" },
      { id: 384, name: "Rayquaza", level: 85, shiny: true, caughtAt: "Pilar Celestial (Camada Y=300)" }
    ],
    shiniesHighlights: [
      { id: 6, name: "Charizard", level: 92 },
      { id: 448, name: "Lucario", level: 86 },
      { id: 130, name: "Gyarados", level: 74 },
      { id: 94, name: "Gengar", level: 82 },
      { id: 384, name: "Rayquaza", level: 85, isLegendary: true }
    ]
  },
  {
    uuid: "b7f1-32ca-9911-4abb",
    username: "Red_Champion",
    avatar: "https://mc-heads.net/avatar/Red/100",
    rank: "Lenda",
    isOnline: true,
    playTime: "210h",
    totalCaptured: 420,
    shiniesCount: 22,
    legendariesCount: 6,
    pokedexProgress: {
      kanto: { seen: 151, caught: 151 },
      johto: { seen: 100, caught: 96 },
      hoenn: { seen: 135, caught: 110 },
      sinnoh: { seen: 95, caught: 80 },
      unova: { seen: 80, caught: 65 },
      kalos: { seen: 50, caught: 44 },
      alola: { seen: 55, caught: 40 },
      galar: { seen: 48, caught: 35 },
      paldea: { seen: 38, caught: 25 }
    },
    party: [
      { id: 3, name: "Venusaur", level: 90, shiny: false, gender: "M", nature: "Bold", ability: "Chlorophyll", types: ["Grass", "Poison"], ivPercent: 91 },
      { id: 6, name: "Charizard", level: 94, shiny: false, gender: "M", nature: "Adamant", ability: "Blaze", types: ["Fire", "Flying"], ivPercent: 93 },
      { id: 9, name: "Blastoise", level: 90, shiny: false, gender: "M", nature: "Modest", ability: "Torrent", types: ["Water"], ivPercent: 89 },
      { id: 25, name: "Pikachu", level: 95, shiny: true, gender: "M", nature: "Hasty", ability: "Static", types: ["Electric"], ivPercent: 98 },
      { id: 131, name: "Lapras", level: 88, shiny: false, gender: "F", nature: "Quiet", ability: "Water Absorb", types: ["Water", "Ice"], ivPercent: 86 },
      { id: 143, name: "Snorlax", level: 91, shiny: false, gender: "M", nature: "Impish", ability: "Immunity", types: ["Normal"], ivPercent: 90 }
    ],
    legendaries: [
      { id: 144, name: "Articuno", level: 75, shiny: false, caughtAt: "Geleira dos Ventos" },
      { id: 145, name: "Zapdos", level: 78, shiny: false, caughtAt: "Torre de Energia Elétrica" },
      { id: 146, name: "Moltres", level: 76, shiny: false, caughtAt: "Vulcão do Nether" },
      { id: 150, name: "Mewtwo", level: 100, shiny: true, caughtAt: "Laboratório Abandonado" },
      { id: 250, name: "Ho-Oh", level: 82, shiny: false, caughtAt: "Torre do Sino" },
      { id: 487, name: "Giratina", level: 88, shiny: false, caughtAt: "Mundo Distorcido do The End" }
    ],
    shiniesHighlights: [
      { id: 25, name: "Pikachu", level: 95 },
      { id: 150, name: "Mewtwo", level: 100, isLegendary: true },
      { id: 282, name: "Gardevoir", level: 78 },
      { id: 658, name: "Greninja", level: 85 }
    ]
  },
  {
    uuid: "c3d4-88aa-1221-7ffe",
    username: "Cynthia_Shinnoh",
    avatar: "https://mc-heads.net/avatar/Cynthia/100",
    rank: "Campeã Regional",
    isOnline: false,
    playTime: "115h",
    totalCaptured: 290,
    shiniesCount: 9,
    legendariesCount: 3,
    pokedexProgress: {
      kanto: { seen: 120, caught: 98 },
      johto: { seen: 80, caught: 62 },
      hoenn: { seen: 90, caught: 71 },
      sinnoh: { seen: 107, caught: 105 },
      unova: { seen: 50, caught: 38 },
      kalos: { seen: 40, caught: 29 },
      alola: { seen: 35, caught: 22 },
      galar: { seen: 30, caught: 18 },
      paldea: { seen: 25, caught: 14 }
    },
    party: [
      { id: 445, name: "Garchomp", level: 96, shiny: false, gender: "F", nature: "Jolly", ability: "Rough Skin", types: ["Dragon", "Ground"], ivPercent: 99 },
      { id: 448, name: "Lucario", level: 88, shiny: false, gender: "M", nature: "Naive", ability: "Inner Focus", types: ["Fighting", "Steel"], ivPercent: 92 },
      { id: 468, name: "Togekiss", level: 85, shiny: true, gender: "F", nature: "Timid", ability: "Serene Grace", types: ["Fairy", "Flying"], ivPercent: 95 },
      { id: 442, name: "Spiritomb", level: 84, shiny: false, gender: "F", nature: "Infiltrator", ability: "Pressure", types: ["Ghost", "Dark"], ivPercent: 90 },
      { id: 350, name: "Milotic", level: 86, shiny: false, gender: "F", nature: "Bold", ability: "Marvel Scale", types: ["Water"], ivPercent: 94 },
      { id: 407, name: "Roserade", level: 82, shiny: false, gender: "F", nature: "Timid", ability: "Natural Cure", types: ["Grass", "Poison"], ivPercent: 88 }
    ],
    legendaries: [
      { id: 483, name: "Dialga", level: 90, shiny: false, caughtAt: "Pilar da Lança" },
      { id: 484, name: "Palkia", level: 90, shiny: false, caughtAt: "Fenda Espacial" },
      { id: 493, name: "Arceus", level: 100, shiny: false, caughtAt: "Templo Celestial Ancestral" }
    ],
    shiniesHighlights: [
      { id: 468, name: "Togekiss", level: 85 },
      { id: 133, name: "Eevee", level: 45 },
      { id: 257, name: "Blaziken", level: 80 }
    ]
  },
  {
    uuid: "d9e8-77bb-4332-11cc",
    username: "Silver_Rival",
    avatar: "https://mc-heads.net/avatar/Silver/100",
    rank: "Treinador Veterano",
    isOnline: false,
    playTime: "76h",
    totalCaptured: 198,
    shiniesCount: 6,
    legendariesCount: 2,
    pokedexProgress: {
      kanto: { seen: 110, caught: 80 },
      johto: { seen: 100, caught: 88 },
      hoenn: { seen: 70, caught: 45 },
      sinnoh: { seen: 40, caught: 25 },
      unova: { seen: 30, caught: 18 },
      kalos: { seen: 25, caught: 15 },
      alola: { seen: 20, caught: 10 },
      galar: { seen: 18, caught: 9 },
      paldea: { seen: 15, caught: 6 }
    },
    party: [
      { id: 160, name: "Feraligatr", level: 82, shiny: false, gender: "M", nature: "Adamant", ability: "Sheer Force", types: ["Water"], ivPercent: 91 },
      { id: 215, name: "Sneasel", level: 74, shiny: true, gender: "M", nature: "Jolly", ability: "Inner Focus", types: ["Dark", "Ice"], ivPercent: 88 },
      { id: 169, name: "Crobat", level: 78, shiny: false, gender: "M", nature: "Jolly", ability: "Infiltrator", types: ["Poison", "Flying"], ivPercent: 86 },
      { id: 94, name: "Gengar", level: 80, shiny: false, gender: "M", nature: "Timid", ability: "Cursed Body", types: ["Ghost", "Poison"], ivPercent: 89 },
      { id: 82, name: "Magneton", level: 70, shiny: false, gender: "N", nature: "Modest", ability: "Magnet Pull", types: ["Electric", "Steel"], ivPercent: 85 },
      { id: 248, name: "Tyranitar", level: 84, shiny: false, gender: "M", nature: "Careful", ability: "Sand Stream", types: ["Rock", "Dark"], ivPercent: 93 }
    ],
    legendaries: [
      { id: 243, name: "Raikou", level: 70, shiny: false, caughtAt: "Planícies Tempestuosas" },
      { id: 244, name: "Entei", level: 72, shiny: false, caughtAt: "Montanha de Lava" }
    ],
    shiniesHighlights: [
      { id: 215, name: "Sneasel", level: 74 },
      { id: 179, name: "Mareep", level: 32 }
    ]
  }
]

// Função auxiliar para pegar sprite animado do Pokémon
export function getPokemonSprite(id, shiny = false) {
  // Showdown animated sprites
  const baseUrl = shiny 
    ? 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny'
    : 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown';
  return `${baseUrl}/${id}.gif`;
}

// Fallback estático
export function getPokemonStaticSprite(id, shiny = false) {
  const baseUrl = shiny
    ? 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny'
    : 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
  return `${baseUrl}/${id}.png`;
}

// Cores dos tipos de Pokémon
export const typeColors = {
  Normal: '#A8A77A',
  Fire: '#EE8130',
  Water: '#6390F0',
  Electric: '#F7D02C',
  Grass: '#7AC74C',
  Ice: '#96D9D6',
  Fighting: '#C22E28',
  Poison: '#A33EA1',
  Ground: '#E2BF65',
  Flying: '#A98FF3',
  Psychic: '#F95587',
  Bug: '#A6B91A',
  Rock: '#B6A136',
  Ghost: '#735797',
  Dragon: '#6F35FC',
  Dark: '#705746',
  Steel: '#B7B7CE',
  Fairy: '#D685AD'
}
