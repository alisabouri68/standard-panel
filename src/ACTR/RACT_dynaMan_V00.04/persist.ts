// types.ts

import { MemoryLayer } from './memory'
import { LocalStorageLayer } from './localStorage'
import { SessionStorageLayer } from './sessionStorage'
import { CookieHelper } from './cookie'
import { PersistConfig } from './types'
import { defaultSerializer } from './serializer'

/**
 * Stores debounce timers for each key
 */
const writeTimers = new Map<string, number>()

/**
 * Default debounce delay for writing to layers (ms)
 */
const writeDelayMs = 150

/**
 * Persist a value to configured layers with debounce and TTL support
 * Layer order is defined by cfg.layers
 * @param cfg PersistConfig for the target path
 * @param value Value to persist
 */
export async function persistToLayers (cfg: PersistConfig, value: any) {
  const key = cfg.key ?? cfg.path
  let payload: any = value

  // Attach TTL metadata if configured
  if (cfg.ttlMs) {
    payload = { __dyna_meta: { expiresAt: Date.now() + cfg.ttlMs }, value }
  }

  const ser = cfg.serializer ?? defaultSerializer
  const serialized = ser.serialize(payload)

  // Clear previous debounce timer if it exists
  if (writeTimers.has(key)) clearTimeout(writeTimers.get(key))

  // Set a new debounce timer
  const timer = window.setTimeout(() => {
    for (const layer of cfg.layers) {
      try {
        if (layer === 'memory') MemoryLayer.set(key, payload)
        if (layer === 'local') LocalStorageLayer.set(key, serialized)
        if (layer === 'session') SessionStorageLayer.set(key, serialized)
        if (layer === 'cookie')
          CookieHelper.set(key, serialized, {
            expiresDays: Math.ceil((cfg.ttlMs ?? 0) / (24 * 3600 * 1000)) || 365
          })
      } catch (e) {
        console.warn('[DynaManager] persistToLayers error', layer, e)
      }
    }
    writeTimers.delete(key)
  }, writeDelayMs)

  writeTimers.set(key, timer)
}

/**
 * Read a value using fallback order: Memory -> Redux -> storage layers
 * If the TTL has expired, the value will be cleared
 * @param cfg PersistConfig for the target path
 * @param reduxValue Optional fallback value from Redux
 * @returns Final resolved value or undefined
 */
export async function readFromLayers (
  cfg: PersistConfig,
  reduxValue?: any
): Promise<any> {
  const key = cfg.key ?? cfg.path
  const ser = cfg.serializer ?? defaultSerializer

  // First, try memory layer
  const mem = MemoryLayer.get(key)
  if (mem !== undefined) return unwrapTTL(mem)

  // Fallback to Redux value
  if (reduxValue !== undefined) return reduxValue

  // Then try storage layers
  for (const layer of cfg.layers) {
    try {
      let raw: string | undefined
      if (layer === 'local') raw = LocalStorageLayer.get(key) ?? undefined
      if (layer === 'session') raw = SessionStorageLayer.get(key) ?? undefined
      if (layer === 'cookie') raw = CookieHelper.get(key)

      if (raw != null) {
        const data = ser.deserialize(raw)
        const unwrapped = unwrapTTL(data)
        if (unwrapped === undefined) {
          // Expired -> clear from all layers
          await clearPersist(cfg)
          continue
        }
        // Write to memory for faster subsequent reads
        MemoryLayer.set(key, data)
        return unwrapped
      }
    } catch (e) {
      console.warn('[DynaManager] readFromLayers error', layer, e)
    }
  }

  return undefined
}

/**
 * Clear a persisted value from all configured layers
 * @param cfg PersistConfig for the target path
 */
export async function clearPersist (cfg: PersistConfig) {
  const key = cfg.key ?? cfg.path
  for (const layer of cfg.layers) {
    try {
      if (layer === 'memory') MemoryLayer.delete(key)
      if (layer === 'local') LocalStorageLayer.delete(key)
      if (layer === 'session') SessionStorageLayer.delete(key)
      if (layer === 'cookie') CookieHelper.delete(key)
    } catch (e) {
      console.warn('[DynaManager] clearPersist error', layer, e)
    }
  }
}

/**
 * Unwrap a value that may contain TTL metadata
 * Returns undefined if the value has expired
 * @param data Stored value
 * @returns Actual value or undefined
 */
function unwrapTTL (data: any) {
  if (data?.__dyna_meta?.expiresAt && Date.now() > data.__dyna_meta.expiresAt)
    return undefined
  return data?.__dyna_meta ? data.value : data
}
