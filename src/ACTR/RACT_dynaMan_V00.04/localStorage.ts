// types.ts

/**
 * LocalStorageLayer
 * Simple layer for accessing localStorage with get, set, and delete methods
 */
export const LocalStorageLayer = {
  /**
   * Read a value from localStorage
   * @param key Target key
   * @returns Stored value or null if not found
   */
  get (key: string): string | null {
    return localStorage.getItem(key)
  },

  /**
   * Save a value to localStorage
   * @param key Target key
   * @param value String value to store
   */
  set (key: string, value: string): void {
    localStorage.setItem(key, value)
  },

  /**
   * Remove a value from localStorage
   * @param key Target key
   */
  delete (key: string): void {
    localStorage.removeItem(key)
  }
}
