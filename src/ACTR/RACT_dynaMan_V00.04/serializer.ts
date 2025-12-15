/**
 * defaultSerializer
 * Default serializer for persisting data to storage
 * - Converts Date objects into a JSON-friendly structure
 * - Restores Date objects during deserialization
 */
export const defaultSerializer = {
  /**
   * Convert a value to a string for storage
   * @param v Value to serialize (object, array, Date, primitive)
   * @returns JSON string
   */
  serialize: (v: any): string =>
    JSON.stringify(v, (_k, val) =>
      val instanceof Date ? { __isDate: true, value: val.toISOString() } : val
    ),

  /**
   * Convert a JSON string back to the original value
   * @param s JSON string
   * @returns Original value with Date objects restored
   */
  deserialize: (s: string): any =>
    JSON.parse(s, (_k, val) => (val?.__isDate ? new Date(val.value) : val))
}