// types.ts

/**
 * CookieHelper
 * A collection of helper functions for managing browser cookies
 */
export const CookieHelper = {
  /**
   * Get a cookie value by name
   * @param name Cookie name
   * @returns Cookie value or undefined if not found
   */
  get(name: string) {
    const matches = document.cookie.match(
      new RegExp(
        '(?:^|; )' + name.replace(/([.$?*|{}()[\]\/+^])/g, '\$1') + '=([^;]*)'
      )
    )
    return matches ? decodeURIComponent(matches[1]) : undefined
  },

  /**
   * Set a cookie with the given name and value
   * @param name Cookie name
   * @param value Cookie value
   * @param opts Optional settings
   *   - expiresDays: Number of days until the cookie expires
   *   - path: Cookie path (default '/')
   */
  set(
    name: string,
    value: string,
    opts?: { expiresDays?: number; path?: string }
  ) {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

    if (opts?.expiresDays != null) {
      const d = new Date()
      d.setTime(d.getTime() + opts.expiresDays * 24 * 3600 * 1000)
      cookie += `; expires=${d.toUTCString()}`
    }

    cookie += `; path=${opts?.path || '/'}`
    document.cookie = cookie
  },

  /**
   * Delete a cookie by name
   * @param name Cookie name to remove
   */
  delete(name: string) {
    // Delete by setting a negative expiration
    this.set(name, '', { expiresDays: -1 })
  }
}
