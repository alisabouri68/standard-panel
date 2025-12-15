// types.ts

/**
 * Callback invoked when a value changes in DynaManager.
 * @param value New value of the path or the entire state
 */
export type DynaCallback = (value: any) => void

/**
 * Storage layers that DynaManager can use.
 */
export type StorageLayer =
  | 'memory'    // in-memory internal cache
  | 'local'     // localStorage
  | 'session'   // sessionStorage
  | 'cookie'    // browser cookie
  | 'indexedDB' // indexedDB (for future extension)
  | 'none'      // no persistence

/**
 * Persistence configuration for a specific state path
 */
export interface PersistConfig {
  /** State path that should be persisted */
  path: string

  /** Storage layers where the value should be stored */
  layers: StorageLayer[]

  /** Time-to-live (TTL) in milliseconds */
  ttlMs?: number

  /** Storage key to use (optional, default = path) */
  key?: string

  /** Custom serializer for encoding/decoding the value (optional) */
  serializer?: {
    /** Serialize function to convert value to string */
    serialize: (v: any) => string
    /** Deserialize function to convert string back to value */
    deserialize: (s: string) => any
  }
}

/**
 * A registered subscriber in DynaManager
 */
export interface SubscribeEntry {
  /** Unique subscriber identifier */
  id: symbol

  /** Specific path to subscribe to (optional, undefined means entire state) */
  path?: string

  /** Callback invoked when the value changes */
  cb: DynaCallback

  /** Last value received by the subscriber (used to avoid unnecessary notifications) */
  lastValue?: any

  /** If true, only shallow (top-level) changes are checked */
  shallow?: boolean
}
