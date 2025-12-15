// types.ts

/**
 * getByPath
 * Safely access a nested path within an object
 * @param obj Root object
 * @param path Path in the form of 'a.b.c' (optional)
 * @returns Value at the given path, or the entire object if path is undefined
 */
export function getByPath(obj: any, path?: string) {
  if (!path) return obj
  return path.split('.').reduce((acc, key) => (acc != null ? acc[key] : undefined), obj)
}

/**
 * shallowEqual
 * Check shallow (top-level) equality of two objects
 * @param a First object
 * @param b Second object
 * @returns true if all top-level key-value pairs are equal
 */
export function shallowEqual(a: any, b: any) {
  if (a === b) return true
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) return false
  return aKeys.every(k => a[k] === b[k])
}

/**
 * deepEqual
 * Recursively check equality of two objects or arrays
 * @param a First value
 * @param b Second value
 * @returns true if all values and structures are equal
 */
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    if (Array.isArray(a) !== Array.isArray(b)) return false
    if (Array.isArray(a)) return a.length === b.length && a.every((v, i) => deepEqual(v, b[i]))
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)
    if (aKeys.length !== bKeys.length) return false
    return aKeys.every(k => deepEqual(a[k], b[k]))
  }
  return false
}
