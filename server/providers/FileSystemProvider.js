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
      const parsed = parseNbtBuffer(buf)
      return parsed || null
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
    const hours = ticks > 0 ? Math.max(1, Math.round(ticks / 20 / 3600)) : 0
    return `${hours}h`
  }

  /**
   * Detecta em tempo real quem está online lendo o logs/latest.log do servidor Minecraft
   */
  async getOnlineUsernamesFromLog() {
    const onlineSet = new Set()
    const logPath = path.join(this.serverPath, 'logs', 'latest.log')
    try {
      const content = await fs.readFile(logPath, 'utf8')
      const lines = content.split(/\r?\n/)
      for (const line of lines) {
        if (line.includes('Starting minecraft server version') || line.includes('Stopping server')) {
          onlineSet.clear()
          continue
        }

        const joinMatch = line.match(/\]: ([A-Za-z0-9_]{2,16}) joined the game/)
        if (joinMatch) {
          onlineSet.add(joinMatch[1].toLowerCase())
          continue
        }
        const loginMatch = line.match(/\]: ([A-Za-z0-9_]{2,16})\[\/[^\]]+\] logged in with entity id/)
        if (loginMatch) {
          onlineSet.add(loginMatch[1].toLowerCase())
          continue
        }

        const leaveMatch = line.match(/\]: ([A-Za-z0-9_]{2,16}) left the game/)
        if (leaveMatch) {
          onlineSet.delete(leaveMatch[1].toLowerCase())
          continue
        }
        const lostMatch = line.match(/\]: ([A-Za-z0-9_]{2,16}) lost connection:/)
        if (lostMatch) {
          onlineSet.delete(lostMatch[1].toLowerCase())
          continue
        }
      }
    } catch {
      // Caso latest.log não exista
    }
    return onlineSet
  }

  parsePokemonSlotNbt(slot, fallbackIdx = 1) {
    if (!slot || typeof slot !== 'object') return null
    const rawSpecies = slot.Species || slot.species || ''
    if (!rawSpecies) return null

    const meta = resolveSpecies(rawSpecies, fallbackIdx)
    const rawIvs = slot.IVs?.Base || slot.IVs || slot.ivs?.Base || slot.ivs || {}
    const hasIvs = Object.keys(rawIvs).length > 0

    const hp = Number(rawIvs['cobblemon:hp'] ?? rawIvs.hp ?? 0)
    const atk = Number(rawIvs['cobblemon:attack'] ?? rawIvs.attack ?? 0)
    const def = Number(rawIvs['cobblemon:defence'] ?? rawIvs.defence ?? rawIvs.defense ?? 0)
    const spa = Number(rawIvs['cobblemon:special_attack'] ?? rawIvs.special_attack ?? 0)
    const spd = Number(rawIvs['cobblemon:special_defence'] ?? rawIvs.special_defence ?? rawIvs.special_defense ?? 0)
    const spe = Number(rawIvs['cobblemon:speed'] ?? rawIvs.speed ?? 0)

    const ivTotal = hp + atk + def + spa + spd + spe
    const ivPercent = hasIvs ? Math.min(100, Math.round((ivTotal / 186) * 100)) : 0

    const rawNature = String(slot.Nature || slot.nature || 'Hardy')
      .replace(/^cobblemon:/, '')
    const formattedNature = rawNature.charAt(0).toUpperCase() + rawNature.slice(1)

    const rawAbility = String(
      slot.Ability?.AbilityName || slot.Ability || slot.ability || 'Padrão'
    ).replace(/^cobblemon:/, '')
    const formattedAbility = rawAbility.charAt(0).toUpperCase() + rawAbility.slice(1)

    // No NBT do Cobblemon, Shiny é um byte (1 = true, 0 = false) ou dentro de aspects
    const isShinyByte = slot.Shiny === 1 || slot.Shiny === true || slot.shiny === 1 || slot.shiny === true
    const hasShinyAspect = Array.isArray(slot.Aspects) && slot.Aspects.includes('shiny')

    return {
      id: meta.id,
      name: meta.name,
      level: Number(slot.Level ?? slot.level ?? 1),
      shiny: Boolean(isShinyByte || hasShinyAspect),
      isLegendary: meta.isLegendary,
      gender: slot.Gender === 'FEMALE' ? 'F' : slot.Gender === 'GENDERLESS' ? 'N' : 'M',
      nature: formattedNature,
      ability: formattedAbility,
      types: meta.types,
      ivPercent
    }
  }

  extractPokemonListFromCompound(compound) {
    if (!compound || typeof compound !== 'object') return []
    const results = []

    const visit = (node) => {
      if (!node || typeof node !== 'object') return
      if (node.Species || node.species) {
        const p = this.parsePokemonSlotNbt(node, results.length + 1)
        if (p) results.push(p)
        return
      }
      for (const val of Object.values(node)) {
        if (val && typeof val === 'object') {
          visit(val)
        }
      }
    }

    visit(compound)
    return results
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

      const extracted = this.extractPokemonListFromCompound(parsed)
      if (extracted.length > 0) return extracted.slice(0, 6)
    }

    const cobblemonFile = path.join(this.worldPath, 'cobblemonplayerdata', prefix, `${uuid}.json`)
    const cobbleData = await this.readJsonSafe(cobblemonFile)
    if (Array.isArray(cobbleData?.party)) {
      return this.normalizePartyList(cobbleData.party)
    }

    return []
  }

  async readRealPcPokemon(uuid, prefix) {
    const nbtPath = path.join(this.worldPath, 'pokemon', 'pcstore', prefix, `${uuid}.dat`)
    const parsed = await this.readNbtSafe(nbtPath)
    if (!parsed) return []
    return this.extractPokemonListFromCompound(parsed)
  }

  async readRealPokedex(uuid, prefix, cobbleData = {}, ownedPokemon = []) {
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

    const seenIds = new Set()
    const caughtIds = new Set()
    const shinyIds = new Set()

    // 1. Lê a estrutura exata do Cobblemon 1.6 em world/pokedex/<prefix>/<uuid>.nbt
    // Estrutura real: { speciesRecords: { "cobblemon:sprigatito": { aspects: [...], formRecords: { normal: { knowledge: "CAUGHT" | "ENCOUNTERED", seenShinyStates: ["normal"] } } } } }
    const nbtPath = path.join(this.worldPath, 'pokedex', prefix, `${uuid}.nbt`)
    const parsed = await this.readNbtSafe(nbtPath)
    const speciesRecords = parsed?.speciesRecords || {}

    if (speciesRecords && typeof speciesRecords === 'object') {
      for (const [speciesKey, recordObj] of Object.entries(speciesRecords)) {
        if (!recordObj || typeof recordObj !== 'object') continue
        const meta = resolveSpecies(speciesKey, 0)
        if (!meta.id || meta.id < 1 || meta.id > 1025) continue

        seenIds.add(meta.id)

        // Verifica formRecords.<form>.knowledge === "CAUGHT"
        let isCaught = false
        const formRecords = recordObj.formRecords || {}
        for (const formVal of Object.values(formRecords)) {
          if (formVal && formVal.knowledge === 'CAUGHT') {
            isCaught = true
            break
          }
        }

        if (isCaught) {
          caughtIds.add(meta.id)
        }

        // Um Pokémon na Pokédex só é Shiny capturado pelo jogador se tiver "shiny" dentro de recordObj.aspects (e tiver sido CAUGHT)
        const aspects = Array.isArray(recordObj.aspects) ? recordObj.aspects : []
        if (isCaught && aspects.some(a => String(a).toLowerCase() === 'shiny')) {
          shinyIds.add(meta.id)
        }
      }
    }

    // 2. Mescla dados de cobblemonplayerdata/<prefix>/<uuid>.json (aspectsCollected)
    const adv = cobbleData?.advancementData || {}
    const aspectsMap = adv.aspectsCollected || adv.totalAspectsCollected || {}
    for (const [speciesKey, aspects] of Object.entries(aspectsMap)) {
      const meta = resolveSpecies(speciesKey, 0)
      if (meta.id >= 1 && meta.id <= 1025) {
        seenIds.add(meta.id)
        caughtIds.add(meta.id)
        if (Array.isArray(aspects) && aspects.some(a => String(a).toLowerCase() === 'shiny')) {
          shinyIds.add(meta.id)
        }
      }
    }

    // 3. Mescla todos os Pokémon presentes atualmente na Party e no PC do jogador
    for (const poke of ownedPokemon) {
      if (poke.id >= 1 && poke.id <= 1025) {
        seenIds.add(poke.id)
        caughtIds.add(poke.id)
        if (poke.shiny) {
          shinyIds.add(poke.id)
        }
      }
    }

    // 4. Contabiliza progresso regional real a partir dos IDs únicos vistos e capturados
    for (const id of seenIds) {
      const reg = getRegionByDexId(id)
      if (pokedex[reg]) pokedex[reg].seen += 1
    }
    for (const id of caughtIds) {
      const reg = getRegionByDexId(id)
      if (pokedex[reg]) pokedex[reg].caught += 1
    }

    return {
      pokedex,
      seenIds: Array.from(seenIds),
      caughtIds: Array.from(caughtIds),
      shinyIds: Array.from(shinyIds)
    }
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
        ivPercent: Number(entry.ivPercent) || 0
      }
    })
  }

  async getPlayers() {
    const usercachePath = path.join(this.serverPath, 'usercache.json')
    const usercache = (await this.readJsonSafe(usercachePath, [])) || []
    const onlineUsersSet = await this.getOnlineUsernamesFromLog()

    const players = []
    for (const entry of usercache) {
      const uuid = entry.uuid
      const username = entry.name
      if (!uuid || !username) continue

      const isOnline =
        onlineUsersSet.has(username.toLowerCase()) ||
        Boolean(entry.isOnline)

      const prefix = uuid.replace(/-/g, '').slice(0, 2)
      const cobblemonFile = path.join(this.worldPath, 'cobblemonplayerdata', prefix, `${uuid}.json`)
      const cobbleData = (await this.readJsonSafe(cobblemonFile, {})) || {}
      const adv = cobbleData.advancementData || {}

      const playTime = await this.getPlayTimeHours(uuid)
      const party = await this.readRealParty(uuid, prefix)
      const pcPokemon = await this.readRealPcPokemon(uuid, prefix)
      const allOwnedPokemon = [...party, ...pcPokemon]

      const { pokedex: pokedexProgress, seenIds, caughtIds, shinyIds } =
        await this.readRealPokedex(uuid, prefix, cobbleData, allOwnedPokemon)

      // Lista de Shinies reais na Party e no PC (com o nível real do Pokémon!)
      const shiniesHighlights = allOwnedPokemon
        .filter(p => p.shiny)
        .map(p => ({
          id: p.id,
          name: p.name,
          level: p.level,
          shiny: true,
          isLegendary: p.isLegendary
        }))

      // Lista de Lendários reais na Party e no PC
      const legendaries = allOwnedPokemon
        .filter(p => p.isLegendary)
        .map(p => ({
          id: p.id,
          name: p.name,
          level: p.level,
          shiny: p.shiny,
          caughtAt: 'Servidor Cobblemon'
        }))

      // Total de espécies únicas capturadas na Pokédex
      const totalCaptured = caughtIds.length

      // Total real de Shinies (da Party + PC ou contador oficial do Cobblemon)
      const shiniesCount = Math.max(
        shiniesHighlights.length,
        Number(adv.totalShinyCaptureCount) || 0
      )

      const legendariesCount = legendaries.length

      players.push({
        uuid,
        username,
        avatar: `https://mc-heads.net/avatar/${encodeURIComponent(username)}/100`,
        rank:
          totalCaptured >= 150
            ? 'Mestre da Pokédex'
            : totalCaptured >= 50
              ? 'Colecionador Cobblemon'
              : totalCaptured > 0
                ? 'Treinador Cobblemon'
                : 'Iniciante',
        isOnline: isOnline || Boolean(cobbleData.isOnline),
        playTime,
        totalCaptured,
        shiniesCount,
        legendariesCount,
        pokedexProgress,
        seenIds,
        caughtIds,
        shinyIds,
        party,
        legendaries,
        shiniesHighlights
      })
    }

    return players.sort((a, b) => b.totalCaptured - a.totalCaptured)
  }
}
