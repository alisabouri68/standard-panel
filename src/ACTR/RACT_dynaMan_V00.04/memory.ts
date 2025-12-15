// types.ts

/**
 * MemoryLayer
 * In-memory cache layer for fast access to values
 * Used by DynaManager for multi-layer persistence
 */
const cache = new Map<string, any>()

export const MemoryLayer = {
  /**
   * Read a value from the cache
   * @param key Target key
   * @returns Stored value or undefined if not found
   */
  get (key: string): any {
    return cache.get(key)
  },

  /**
   * Store a value in the cache
   * @param key Target key
   * @param value Value to store
   */
  set (key: string, value: any): void {
    cache.set(key, value)
  },

  /**
   * Remove a value from the cache
   * @param key Target key
   */
  delete (key: string): void {
    cache.delete(key)
  },

  /**
   * Clear the entire cache
   */
  clear (): void {
    cache.clear()
  }
}
