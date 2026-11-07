import fsSync from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const NAMES_PATH = path.resolve(__dirname, '../../src/data/pokemonNames.json')

let ALL_POKEMON_NAMES = []
try {
  ALL_POKEMON_NAMES = JSON.parse(fsSync.readFileSync(NAMES_PATH, 'utf8'))
} catch {
  ALL_POKEMON_NAMES = []
}

export const REGIONS_META = [
  { id: 'kanto', range: [1, 151] },
  { id: 'johto', range: [152, 251] },
  { id: 'hoenn', range: [252, 386] },
  { id: 'sinnoh', range: [387, 493] },
  { id: 'unova', range: [494, 649] },
  { id: 'kalos', range: [650, 721] },
  { id: 'alola', range: [722, 809] },
  { id: 'galar', range: [810, 905] },
  { id: 'paldea', range: [906, 1025] }
]

export const LEGENDARY_IDS = new Set([
  144, 145, 146, 150, 151,
  243, 244, 245, 249, 250, 251,
  377, 378, 379, 380, 381, 382, 383, 384, 385, 386,
  480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493,
  494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649,
  716, 717, 718, 719, 720, 721,
  772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 800, 801, 802, 807, 808, 809,
  888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 905,
  1001, 1002, 1003, 1004, 1007, 1008, 1014, 1015, 1016, 1017, 1024, 1025
])

export const SPECIES_TYPES_MAP = {
  bulbasaur: ['Grass', 'Poison'],
  ivysaur: ['Grass', 'Poison'],
  venusaur: ['Grass', 'Poison'],
  charmander: ['Fire'],
  charmeleon: ['Fire'],
  charizard: ['Fire', 'Flying'],
  squirtle: ['Water'],
  wartortle: ['Water'],
  blastoise: ['Water'],
  pikachu: ['Electric'],
  gengar: ['Ghost', 'Poison'],
  gyarados: ['Water', 'Flying'],
  lapras: ['Water', 'Ice'],
  eevee: ['Normal'],
  snorlax: ['Normal'],
  articuno: ['Ice', 'Flying'],
  zapdos: ['Electric', 'Flying'],
  moltres: ['Fire', 'Flying'],
  dragonite: ['Dragon', 'Flying'],
  mewtwo: ['Psychic'],
  mew: ['Psychic'],
  feraligatr: ['Water'],
  crobat: ['Poison', 'Flying'],
  mareep: ['Electric'],
  ampharos: ['Electric'],
  espeon: ['Psychic'],
  umbreon: ['Dark'],
  scizor: ['Bug', 'Steel'],
  heracross: ['Bug', 'Fighting'],
  raikou: ['Electric'],
  entei: ['Fire'],
  suicune: ['Water'],
  tyranitar: ['Rock', 'Dark'],
  lugia: ['Psychic', 'Flying'],
  hooh: ['Fire', 'Flying'],
  blaziken: ['Fire', 'Fighting'],
  gardevoir: ['Psychic', 'Fairy'],
  milotic: ['Water'],
  rayquaza: ['Dragon', 'Flying'],
  infernape: ['Fire', 'Fighting'],
  luxray: ['Electric'],
  garchomp: ['Dragon', 'Ground'],
  riolu: ['Fighting'],
  lucario: ['Fighting', 'Steel'],
  weavile: ['Dark', 'Ice'],
  magnezone: ['Electric', 'Steel'],
  togekiss: ['Fairy', 'Flying'],
  gliscor: ['Ground', 'Flying'],
  dialga: ['Steel', 'Dragon'],
  palkia: ['Water', 'Dragon'],
  giratina: ['Ghost', 'Dragon'],
  arceus: ['Normal'],
  greninja: ['Water', 'Dark']
}

// Índice dinâmico completo para todos os 1025 Pokémon
const FULL_DEX_INDEX = new Map()
ALL_POKEMON_NAMES.forEach((rawName, idx) => {
  const dexId = idx + 1
  const cleanFull = rawName.toLowerCase().replace(/[^a-z0-9]/g, '')
  const basePrefix = rawName.split('-')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
  const displayName = rawName.replace(/-/g, ' ')

  FULL_DEX_INDEX.set(cleanFull, { id: dexId, name: displayName })
  if (!FULL_DEX_INDEX.has(basePrefix)) {
    FULL_DEX_INDEX.set(basePrefix, { id: dexId, name: rawName.split('-')[0] })
  }
})

export function resolveSpecies(rawSpecies, fallbackId = 1) {
  const cleanKey = String(rawSpecies || '')
    .toLowerCase()
    .replace(/^cobblemon:/, '')
    .replace(/[^a-z0-9]/g, '')

  const found = FULL_DEX_INDEX.get(cleanKey)
  if (found) {
    return {
      id: found.id,
      name: found.name,
      types: SPECIES_TYPES_MAP[cleanKey] || ['Normal'],
      isLegendary: LEGENDARY_IDS.has(found.id)
    }
  }

  const byIdName = ALL_POKEMON_NAMES[fallbackId - 1]
  const formattedName = byIdName
    ? byIdName.replace(/-/g, ' ')
    : cleanKey
      ? cleanKey.charAt(0).toUpperCase() + cleanKey.slice(1)
      : `Pokemon #${fallbackId}`

  return {
    id: fallbackId,
    name: formattedName,
    types: SPECIES_TYPES_MAP[cleanKey] || ['Normal'],
    isLegendary: LEGENDARY_IDS.has(fallbackId)
  }
}

export function getRegionByDexId(dexId) {
  for (const reg of REGIONS_META) {
    if (dexId >= reg.range[0] && dexId <= reg.range[1]) {
      return reg.id
    }
  }
  return 'kanto'
}
