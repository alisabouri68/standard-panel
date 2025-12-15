// types.ts

/**
 * SessionStorageLayer
 * Simple layer for accessing sessionStorage with get, set, and delete methods
 */
export const SessionStorageLayer = {
  /**
   * Read a value from sessionStorage
   * @param key Target key
   * @returns Stored value or null if not found
   */
  get(key: string): string | null {
    return sessionStorage.getItem(key)
  },

  /**
   * Save a value to sessionStorage
   * @param key Target key
   * @param value String value to store
   */
  set(key: string, value: string): void {
    sessionStorage.setItem(key, value)
  },

  /**
   * Remove a value from sessionStorage
   * @param key Target key
   */
  delete(key: string): void {
    sessionStorage.removeItem(key)
  }
}
