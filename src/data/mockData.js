// Dados simulados do servidor privado entre amigos
export const serverInfo = {
  name: "PokeHub",
  subtitle: "Acompanhe a nossa jornada no servidor — veja quem está liderando a Pokédex, os Shinies que já brilharam e os Lendários capturados pela galera.",
  version: "Minecraft 1.20.1 • Cobblemon",
  onlinePlayers: 3,
  totalPlayers: 5
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
    username: "Thiago",
    avatar: "https://mc-heads.net/avatar/Thiago/100",
    rank: "Colecionador de Kanto",
    isOnline: true,
    playTime: "68h",
    totalCaptured: 192,
    shiniesCount: 6,
    legendariesCount: 2,
    pokedexProgress: {
      kanto: { seen: 142, caught: 118 },
      johto: { seen: 68, caught: 42 },
      hoenn: { seen: 55, caught: 32 },
      sinnoh: { seen: 34, caught: 18 },
      unova: { seen: 28, caught: 14 },
      kalos: { seen: 20, caught: 10 },
      alola: { seen: 16, caught: 8 },
      galar: { seen: 14, caught: 6 },
      paldea: { seen: 16, caught: 9 }
    },
    party: [
      { id: 6, name: "Charizard", level: 78, shiny: true, gender: "M", nature: "Timid", ability: "Solar Power", item: "Charcoal", types: ["Fire", "Flying"], ivPercent: 92 },
      { id: 131, name: "Lapras", level: 71, shiny: false, gender: "F", nature: "Modest", ability: "Water Absorb", item: "Leftovers", types: ["Water", "Ice"], ivPercent: 86 },
      { id: 448, name: "Lucario", level: 74, shiny: false, gender: "M", nature: "Adamant", ability: "Inner Focus", item: "Expert Belt", types: ["Fighting", "Steel"], ivPercent: 91 },
      { id: 94, name: "Gengar", level: 69, shiny: true, gender: "M", nature: "Timid", ability: "Cursed Body", item: "Spell Tag", types: ["Ghost", "Poison"], ivPercent: 84 },
      { id: 143, name: "Snorlax", level: 67, shiny: false, gender: "M", nature: "Careful", ability: "Thick Fat", item: "Sitrus Berry", types: ["Normal"], ivPercent: 80 },
      { id: 150, name: "Mewtwo", level: 85, shiny: false, isLegendary: true, gender: "N", nature: "Timid", ability: "Pressure", item: "Twisted Spoon", types: ["Psychic"], ivPercent: 95 }
    ],
    legendaries: [
      { id: 150, name: "Mewtwo", level: 85, shiny: false, caughtAt: "Deep Dark (Y=-42)" },
      { id: 144, name: "Articuno", level: 70, shiny: false, caughtAt: "Picos Congelados" }
    ],
    shiniesHighlights: [
      { id: 6, name: "Charizard", level: 78 },
      { id: 94, name: "Gengar", level: 69 },
      { id: 130, name: "Gyarados", level: 58 },
      { id: 133, name: "Eevee", level: 30 },
      { id: 25, name: "Pikachu", level: 45 }
    ]
  },
  {
    uuid: "b7f1-32ca-9911-4abb",
    username: "Alisson",
    avatar: "https://mc-heads.net/avatar/Alisson/100",
    rank: "Mestre dos Shinies",
    isOnline: true,
    playTime: "75h",
    totalCaptured: 174,
    shiniesCount: 9,
    legendariesCount: 1,
    pokedexProgress: {
      kanto: { seen: 125, caught: 98 },
      johto: { seen: 80, caught: 58 },
      hoenn: { seen: 84, caught: 65 },
      sinnoh: { seen: 48, caught: 31 },
      unova: { seen: 32, caught: 17 },
      kalos: { seen: 24, caught: 14 },
      alola: { seen: 21, caught: 11 },
      galar: { seen: 18, caught: 9 },
      paldea: { seen: 22, caught: 13 }
    },
    party: [
      { id: 384, name: "Rayquaza", level: 85, shiny: true, isLegendary: true, gender: "N", nature: "Jolly", ability: "Air Lock", types: ["Dragon", "Flying"], ivPercent: 96 },
      { id: 257, name: "Blaziken", level: 72, shiny: false, gender: "M", nature: "Adamant", ability: "Speed Boost", types: ["Fire", "Fighting"], ivPercent: 88 },
      { id: 282, name: "Gardevoir", level: 70, shiny: true, gender: "F", nature: "Modest", ability: "Trace", types: ["Psychic", "Fairy"], ivPercent: 87 },
      { id: 658, name: "Greninja", level: 75, shiny: true, gender: "M", nature: "Timid", ability: "Protean", types: ["Water", "Dark"], ivPercent: 92 },
      { id: 248, name: "Tyranitar", level: 71, shiny: false, gender: "M", nature: "Careful", ability: "Sand Stream", types: ["Rock", "Dark"], ivPercent: 89 },
      { id: 462, name: "Magnezone", level: 66, shiny: false, gender: "N", nature: "Modest", ability: "Magnet Pull", types: ["Electric", "Steel"], ivPercent: 83 }
    ],
    legendaries: [
      { id: 384, name: "Rayquaza", level: 85, shiny: true, caughtAt: "Picos Elevados (Camada Y=260)" }
    ],
    shiniesHighlights: [
      { id: 384, name: "Rayquaza", level: 85, isLegendary: true },
      { id: 658, name: "Greninja", level: 75 },
      { id: 282, name: "Gardevoir", level: 70 },
      { id: 197, name: "Umbreon", level: 56 }
    ]
  },
  {
    uuid: "c3d4-88aa-1221-7ffe",
    username: "Iorran",
    avatar: "https://mc-heads.net/avatar/Iorran/100",
    rank: "Explorador Lendário",
    isOnline: true,
    playTime: "56h",
    totalCaptured: 158,
    shiniesCount: 4,
    legendariesCount: 3,
    pokedexProgress: {
      kanto: { seen: 112, caught: 85 },
      johto: { seen: 68, caught: 48 },
      hoenn: { seen: 62, caught: 44 },
      sinnoh: { seen: 88, caught: 70 },
      unova: { seen: 44, caught: 26 },
      kalos: { seen: 24, caught: 13 },
      alola: { seen: 20, caught: 10 },
      galar: { seen: 16, caught: 8 },
      paldea: { seen: 15, caught: 7 }
    },
    party: [
      { id: 445, name: "Garchomp", level: 79, shiny: false, gender: "F", nature: "Jolly", ability: "Rough Skin", types: ["Dragon", "Ground"], ivPercent: 95 },
      { id: 392, name: "Infernape", level: 74, shiny: false, gender: "M", nature: "Naive", ability: "Blaze", types: ["Fire", "Fighting"], ivPercent: 88 },
      { id: 468, name: "Togekiss", level: 70, shiny: true, gender: "F", nature: "Timid", ability: "Serene Grace", types: ["Fairy", "Flying"], ivPercent: 90 },
      { id: 350, name: "Milotic", level: 72, shiny: false, gender: "F", nature: "Bold", ability: "Marvel Scale", types: ["Water"], ivPercent: 91 },
      { id: 405, name: "Luxray", level: 68, shiny: true, gender: "M", nature: "Adamant", ability: "Intimidate", types: ["Electric"], ivPercent: 82 },
      { id: 483, name: "Dialga", level: 80, shiny: false, isLegendary: true, gender: "N", nature: "Modest", ability: "Pressure", types: ["Steel", "Dragon"], ivPercent: 93 }
    ],
    legendaries: [
      { id: 483, name: "Dialga", level: 80, shiny: false, caughtAt: "Pico de Gelo Ancestral" },
      { id: 245, name: "Suicune", level: 70, shiny: false, caughtAt: "Lago da Taiga" },
      { id: 145, name: "Zapdos", level: 72, shiny: false, caughtAt: "Savana Tempestuosa" }
    ],
    shiniesHighlights: [
      { id: 468, name: "Togekiss", level: 70 },
      { id: 405, name: "Luxray", level: 68 },
      { id: 447, name: "Riolu", level: 25 }
    ]
  },
  {
    uuid: "e4a5-99cc-3321-44dd",
    username: "Bello",
    avatar: "https://mc-heads.net/avatar/Bello/100",
    rank: "Tático de Batalha",
    isOnline: false,
    playTime: "48h",
    totalCaptured: 135,
    shiniesCount: 3,
    legendariesCount: 1,
    pokedexProgress: {
      kanto: { seen: 96, caught: 72 },
      johto: { seen: 62, caught: 41 },
      hoenn: { seen: 48, caught: 30 },
      sinnoh: { seen: 38, caught: 22 },
      unova: { seen: 25, caught: 13 },
      kalos: { seen: 18, caught: 9 },
      alola: { seen: 14, caught: 6 },
      galar: { seen: 12, caught: 5 },
      paldea: { seen: 11, caught: 4 }
    },
    party: [
      { id: 212, name: "Scizor", level: 73, shiny: true, gender: "M", nature: "Adamant", ability: "Technician", types: ["Bug", "Steel"], ivPercent: 92 },
      { id: 130, name: "Gyarados", level: 70, shiny: false, gender: "M", nature: "Jolly", ability: "Intimidate", types: ["Water", "Flying"], ivPercent: 88 },
      { id: 472, name: "Gliscor", level: 68, shiny: false, gender: "M", nature: "Impish", ability: "Poison Heal", types: ["Ground", "Flying"], ivPercent: 87 },
      { id: 461, name: "Weavile", level: 69, shiny: false, gender: "F", nature: "Jolly", ability: "Pressure", types: ["Dark", "Ice"], ivPercent: 89 },
      { id: 149, name: "Dragonite", level: 75, shiny: false, gender: "M", nature: "Adamant", ability: "Multiscale", types: ["Dragon", "Flying"], ivPercent: 94 },
      { id: 244, name: "Entei", level: 72, shiny: false, isLegendary: true, gender: "N", nature: "Adamant", ability: "Pressure", types: ["Fire"], ivPercent: 90 }
    ],
    legendaries: [
      { id: 244, name: "Entei", level: 72, shiny: false, caughtAt: "Vulcão de Basalto do Nether" }
    ],
    shiniesHighlights: [
      { id: 212, name: "Scizor", level: 73 },
      { id: 149, name: "Dragonite", level: 55 }
    ]
  },
  {
    uuid: "d9e8-77bb-4332-11cc",
    username: "Gregory",
    avatar: "https://mc-heads.net/avatar/Gregory/100",
    rank: "Treinador Estrategista",
    isOnline: false,
    playTime: "39h",
    totalCaptured: 114,
    shiniesCount: 2,
    legendariesCount: 1,
    pokedexProgress: {
      kanto: { seen: 92, caught: 62 },
      johto: { seen: 52, caught: 33 },
      hoenn: { seen: 38, caught: 20 },
      sinnoh: { seen: 28, caught: 14 },
      unova: { seen: 20, caught: 9 },
      kalos: { seen: 14, caught: 6 },
      alola: { seen: 11, caught: 4 },
      galar: { seen: 9, caught: 3 },
      paldea: { seen: 8, caught: 2 }
    },
    party: [
      { id: 160, name: "Feraligatr", level: 68, shiny: false, gender: "M", nature: "Adamant", ability: "Sheer Force", types: ["Water"], ivPercent: 86 },
      { id: 169, name: "Crobat", level: 65, shiny: true, gender: "M", nature: "Jolly", ability: "Infiltrator", types: ["Poison", "Flying"], ivPercent: 82 },
      { id: 181, name: "Ampharos", level: 66, shiny: false, gender: "F", nature: "Modest", ability: "Static", types: ["Electric"], ivPercent: 87 },
      { id: 214, name: "Heracross", level: 64, shiny: false, gender: "M", nature: "Adamant", ability: "Guts", types: ["Bug", "Fighting"], ivPercent: 89 },
      { id: 196, name: "Espeon", level: 65, shiny: false, gender: "F", nature: "Timid", ability: "Magic Bounce", types: ["Psychic"], ivPercent: 85 },
      { id: 243, name: "Raikou", level: 70, shiny: false, isLegendary: true, gender: "N", nature: "Timid", ability: "Pressure", types: ["Electric"], ivPercent: 91 }
    ],
    legendaries: [
      { id: 243, name: "Raikou", level: 70, shiny: false, caughtAt: "Planícies Eletrizadas" }
    ],
    shiniesHighlights: [
      { id: 169, name: "Crobat", level: 65 },
      { id: 179, name: "Mareep", level: 28 }
    ]
  }
]

// Função auxiliar para pegar sprite animado do Pokémon
export function getPokemonSprite(id, shiny = false) {
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
