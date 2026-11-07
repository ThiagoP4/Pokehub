import zlib from 'node:zlib'

/**
 * Leitor nativo de arquivos NBT (.dat / .nbt) comprimidos com GZip do Minecraft/Cobblemon
 * Sem dependências externas (usa apenas Buffer e node:zlib nativos).
 */
export function parseNbtBuffer(rawBuffer) {
  let buffer = rawBuffer
  // Verifica cabeçalho GZip (0x1f 0x8b)
  if (buffer.length >= 2 && buffer[0] === 0x1f && buffer[1] === 0x8b) {
    buffer = zlib.gunzipSync(buffer)
  }

  let offset = 0

  function readByte() {
    const val = buffer.readInt8(offset)
    offset += 1
    return val
  }

  function readUByte() {
    const val = buffer.readUInt8(offset)
    offset += 1
    return val
  }

  function readShort() {
    const val = buffer.readInt16BE(offset)
    offset += 2
    return val
  }

  function readUShort() {
    const val = buffer.readUInt16BE(offset)
    offset += 2
    return val
  }

  function readInt() {
    const val = buffer.readInt32BE(offset)
    offset += 4
    return val
  }

  function readLong() {
    const val = buffer.readBigInt64BE(offset)
    offset += 8
    return Number(val)
  }

  function readFloat() {
    const val = buffer.readFloatBE(offset)
    offset += 4
    return val
  }

  function readDouble() {
    const val = buffer.readDoubleBE(offset)
    offset += 8
    return val
  }

  function readString() {
    const len = readUShort()
    const str = buffer.toString('utf8', offset, offset + len)
    offset += len
    return str
  }

  function readPayload(tagType) {
    switch (tagType) {
      case 1: return readByte()
      case 2: return readShort()
      case 3: return readInt()
      case 4: return readLong()
      case 5: return readFloat()
      case 6: return readDouble()
      case 7: {
        const len = readInt()
        const arr = []
        for (let i = 0; i < len; i++) arr.push(readByte())
        return arr
      }
      case 8: return readString()
      case 9: {
        const itemType = readUByte()
        const len = readInt()
        const list = []
        for (let i = 0; i < len; i++) list.push(readPayload(itemType))
        return list
      }
      case 10: {
        const obj = {}
        while (offset < buffer.length) {
          const nextType = readUByte()
          if (nextType === 0) break
          const name = readString()
          obj[name] = readPayload(nextType)
        }
        return obj
      }
      case 11: {
        const len = readInt()
        const arr = []
        for (let i = 0; i < len; i++) arr.push(readInt())
        return arr
      }
      case 12: {
        const len = readInt()
        const arr = []
        for (let i = 0; i < len; i++) arr.push(readLong())
        return arr
      }
      default:
        throw new Error(`Unsupported NBT tag type: ${tagType}`)
    }
  }

  const rootType = readUByte()
  if (rootType !== 10) {
    throw new Error('Root NBT tag must be Compound (10)')
  }
  readString() // Root name
  return readPayload(10)
}

