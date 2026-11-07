import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseNbtBuffer } from '../utils/nbtParser.js'
import { resolveSpecies, getRegionByDexId } from '../utils/pokemonCatalog.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DEFAULT_SAMPLE_PATH = path.resolve(__dirname, '../sample-world')
const DEFAULT_JAIL_MOUNT_PATH = '/mnt/minecraft_server'

export class FileSystemProvider {
  constructor(options = {}) {
    const autoDetectedPath = fsSync.existsSync(DEFAULT_JAIL_MOUNT_PATH)
      ? DEFAULT_JAIL_MOUNT_PATH
      : DEFAULT_SAMPLE_PATH
    this.serverPath = options.serverPath || process.env.MINECRAFT_SERVER_PATH || autoDetectedPath
    this.worldName = options.worldName || process.env.MINECRAFT_WORLD_NAME || 'world'
  }

  get worldPath() {
    return path.join(this.serverPath, this.worldName)
  }

  async readJsonSafe(filePath, fallback = null) {
    try {
      const raw = await fs.readFile(filePath, 'utf8')
      return JSON.parse(raw)
    } catch {
      return fallback
    }
  }

  async readNbtSafe(filePath) {
    try {
      const buf = await fs.readFile(filePath)
      return parseNbtBuffer(buf)?.value || null
    } catch {
      return null
    }
  }

  async getPlayTimeHours(uuid) {
    const statsFile = path.join(this.worldPath, 'stats', `${uuid}.json`)
    const statsData = await this.readJsonSafe(statsFile)
    const ticks =
      statsData?.stats?.['minecraft:custom']?.['minecraft:play_time'] ??
      statsData?.stats?.['minecraft:custom']?.['minecraft:play_one_minute'] ??
      0
    const hours = Math.max(1, Math.round(ticks / 20 / 3600))
    return `${hours}h`
  }

  parsePokemonSlotNbt(slot, fallbackIdx = 1) {
    if (!slot || typeof slot !== 'object') return null
    const rawSpecies = slot.Species || slot.species || ''
    if (!rawSpecies) return null

    const meta = resolveSpecies(rawSpecies, fallbackIdx)
    const ivs = slot.IVs || slot.ivs || {}
    const ivTotal =
      (Number(ivs.hp ?? ivs['cobblemon:hp']) || 20) +
      (Number(ivs.attack ?? ivs['cobblemon:attack']) || 20) +
      (Number(ivs.defence ?? ivs['cobblemon:defence']) || 20) +
      (Number(ivs.special_attack ?? ivs['cobblemon:special_attack']) || 20) +
      (Number(ivs.special_defence ?? ivs['cobblemon:special_defence']) || 20) +
      (Number(ivs.speed ?? ivs['cobblemon:speed']) || 20)
    const ivPercent = Math.min(100, Math.round((ivTotal / 186) * 100))

    return {
      id: meta.id,
      name: meta.name,
      level: Number(slot.Level || slot.level) || 50,
      shiny: Boolean(slot.Shiny || slot.shiny),
      isLegendary: meta.isLegendary,
      gender: slot.Gender === 'FEMALE' ? 'F' : slot.Gender === 'GENDERLESS' ? 'N' : 'M',
      nature: String(slot.Nature || slot.nature || 'Hardy').replace(/^cobblemon:/, ''),
      ability: String(slot.Ability?.AbilityName || slot.ability || 'Overgrow').replace(/^cobblemon:/, ''),
      types: meta.types,
      ivPercent
    }
  }

  async readRealParty(uuid, prefix) {
    const nbtPath = path.join(this.worldPath, 'pokemon', 'playerpartystore', prefix, `${uuid}.dat`)
    const parsed = await this.readNbtSafe(nbtPath)
    if (parsed) {
      const slots = []
      for (let i = 0; i < 6; i++) {
        const slot = parsed[`Slot${i}`] || parsed[i]
        const poke = this.parsePokemonSlotNbt(slot, i + 1)
        if (poke) slots.push(poke)
      }
      if (slots.length > 0) return slots
    }

    const cobblemonFile = path.join(this.worldPath, 'cobblemonplayerdata', prefix, `${uuid}.json`)
    const cobbleData = await this.readJsonSafe(cobblemonFile)
    if (cobbleData?.party) {
      return this.normalizePartyList(cobbleData.party)
    }

    return []
  }

  async readRealPcPokemon(uuid, prefix) {
    const nbtPath = path.join(this.worldPath, 'pokemon', 'pcstore', prefix, `${uuid}.dat`)
    const parsed = await this.readNbtSafe(nbtPath)
    if (!parsed) return []

    const pcPokemon = []
    for (const [boxKey, boxVal] of Object.entries(parsed)) {
      if (!boxKey.startsWith('Box') || typeof boxVal !== 'object' || !boxVal) continue
      for (const [slotKey, slotVal] of Object.entries(boxVal)) {
        if (!slotKey.startsWith('Slot')) continue
        const poke = this.parsePokemonSlotNbt(slotVal)
        if (poke) pcPokemon.push(poke)
      }
    }
    return pcPokemon
  }

  async readRealPokedex(uuid, prefix) {
    const pokedex = {
      kanto: { seen: 0, caught: 0 },
      johto: { seen: 0, caught: 0 },
      hoenn: { seen: 0, caught: 0 },
      sinnoh: { seen: 0, caught: 0 },
      unova: { seen: 0, caught: 0 },
      kalos: { seen: 0, caught: 0 },
      alola: { seen: 0, caught: 0 },
      galar: { seen: 0, caught: 0 },
      paldea: { seen: 0, caught: 0 }
    }
    const caughtIds = new Set()
    const shinyIds = new Set()

    const nbtPath = path.join(this.worldPath, 'pokedex', prefix, `${uuid}.nbt`)
    const parsed = await this.readNbtSafe(nbtPath)

    if (parsed) {
      const speciesRecords = parsed.speciesRecords || parsed.species || parsed.entries || parsed.records || parsed
      if (typeof speciesRecords === 'object' && speciesRecords !== null) {
        for (const [key, val] of Object.entries(speciesRecords)) {
          if (!key.includes(':') && !val?.species && typeof val !== 'object') continue
          const meta = resolveSpecies(key, 0)
          if (!meta.id) continue

          const reg = getRegionByDexId(meta.id)
          if (pokedex[reg]) {
            pokedex[reg].seen += 1

            // Verifica se foi capturado (em Cobblemon 1.6 formRecords possui knowledge = CAUGHT ou 2)
            const serialized = JSON.stringify(val || '').toUpperCase()
            const isCaught =
              serialized.includes('CAUGHT') ||
              val === 2 ||
              val?.knowledge === 2 ||
              Boolean(val?.caught) ||
              Number(val?.caughtCount) > 0

            if (isCaught) {
              pokedex[reg].caught += 1
              caughtIds.add(meta.id)
            }
            if (serialized.includes('SHINY')) {
              shinyIds.add(meta.id)
            }
          }
        }
        return { pokedex, caughtIds: Array.from(caughtIds), shinyIds: Array.from(shinyIds) }
      }
    }

    const cobblemonFile = path.join(this.worldPath, 'cobblemonplayerdata', prefix, `${uuid}.json`)
    const cobbleData = await this.readJsonSafe(cobblemonFile)
    if (cobbleData?.advancementData?.pokedexProgress) {
      return {
        pokedex: cobbleData.advancementData.pokedexProgress,
        caughtIds: [],
        shinyIds: []
      }
    }

    return { pokedex, caughtIds: [], shinyIds: [] }
  }

  normalizePartyList(rawParty = []) {
    return rawParty.map((entry, idx) => {
      const meta = resolveSpecies(entry.species || entry.name, entry.id || idx + 1)
      return {
        id: entry.id || meta.id,
        name: entry.name || meta.name,
        level: Number(entry.level) || 50,
        shiny: Boolean(entry.shiny),
        isLegendary: Boolean(entry.isLegendary ?? meta.isLegendary),
        gender: entry.gender || 'M',
        nature: entry.nature || 'Hardy',
        ability: entry.ability || 'Overgrow',
        item: entry.item || null,
        types: Array.isArray(entry.types) && entry.types.length ? entry.types : meta.types,
        ivPercent: Number(entry.ivPercent) || 85
      }
    })
  }

  normalizeTrophyList(rawList = []) {
    return rawList.map((entry, idx) => {
      const meta = resolveSpecies(entry.species || entry.name, entry.id || idx + 1)
      return {
        id: entry.id || meta.id,
        name: entry.name || meta.name,
        level: Number(entry.level) || 50,
        shiny: Boolean(entry.shiny),
        isLegendary: Boolean(entry.isLegendary ?? meta.isLegendary),
        caughtAt: entry.caughtAt || 'Mundo Cobblemon'
      }
    })
  }

  async getPlayers() {
    const usercachePath = path.join(this.serverPath, 'usercache.json')
    const usercache = (await this.readJsonSafe(usercachePath, [])) || []

    const players = []
    for (const entry of usercache) {
      const uuid = entry.uuid
      const username = entry.name
      if (!uuid || !username) continue

      const prefix = uuid.replace(/-/g, '').slice(0, 2)
      const cobblemonFile = path.join(this.worldPath, 'cobblemonplayerdata', prefix, `${uuid}.json`)
      const cobbleData = (await this.readJsonSafe(cobblemonFile, {})) || {}

      const playTime = await this.getPlayTimeHours(uuid)
      const party = await this.readRealParty(uuid, prefix)
      const pcPokemon = await this.readRealPcPokemon(uuid, prefix)
      const { pokedex: pokedexProgress, caughtIds, shinyIds } = await this.readRealPokedex(uuid, prefix)

      const allOwnedPokemon = [...party, ...pcPokemon]
      for (const p of allOwnedPokemon) {
        if (!caughtIds.includes(p.id)) {
          caughtIds.push(p.id)
        }
      }

      const shiniesFromOwned = allOwnedPokemon
        .filter(p => p.shiny)
        .map(p => ({ id: p.id, name: p.name, level: p.level, shiny: true, isLegendary: p.isLegendary }))

      const legendariesFromOwned = allOwnedPokemon
        .filter(p => p.isLegendary)
        .map(p => ({
          id: p.id,
          name: p.name,
          level: p.level,
          shiny: p.shiny,
          caughtAt: 'Servidor Cobblemon'
        }))

      const shiniesHighlights =
        shiniesFromOwned.length > 0
          ? shiniesFromOwned
          : this.normalizeTrophyList(cobbleData.shiniesHighlights || [])

      const legendaries =
        legendariesFromOwned.length > 0
          ? legendariesFromOwned
          : this.normalizeTrophyList(cobbleData.legendaries || [])

      const dexCaughtTotal = Object.values(pokedexProgress).reduce((acc, r) => acc + (r.caught || 0), 0)
      const totalCaptured =
        Number(cobbleData.advancementData?.totalCaptureCount) ||
        Math.max(dexCaughtTotal, caughtIds.length, party.length)

      const shiniesCount =
        Number(cobbleData.advancementData?.totalShinyCaptureCount) ||
        Math.max(shiniesHighlights.length, shinyIds.length)

      const legendariesCount =
        Number(cobbleData.advancementData?.totalLegendaryCaptureCount) ||
        legendaries.length

      players.push({
        uuid,
        username,
        avatar: `https://mc-heads.net/avatar/${encodeURIComponent(username)}/100`,
        rank:
          cobbleData.rank ||
          (totalCaptured > 150
            ? 'Mestre Pokémon'
            : totalCaptured > 60
              ? 'Colecionador Cobblemon'
              : 'Treinador em Jornada'),
        isOnline: Boolean(cobbleData.isOnline),
        playTime,
        totalCaptured,
        shiniesCount,
        legendariesCount,
        pokedexProgress,
        caughtIds,
        shinyIds,
        party,
        legendaries,
        shiniesHighlights
      })
    }

    // Ordena por total capturado decrescente
    return players.sort((a, b) => b.totalCaptured - a.totalCaptured)
  }
}
