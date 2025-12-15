import { store } from '../../RDUX/store'
import { setPath, mergePath, bulkSet as reduxBulkSet, reset } from '../../RDUX/dynaEnv/dynaSlice'
import { MemoryLayer } from './memory'
import { persistToLayers, readFromLayers} from './persist'
import { getByPath, deepEqual } from './path'
import { PersistConfig, SubscribeEntry, DynaCallback } from './types'

/**
 * DynaManager
 * Dynamic state manager with support for:
 * - Redux integration
 * - Multi-layer persistence (Memory, LocalStorage, SessionStorage, Cookie)
 * - TTL (Time-To-Live)
 * - Debounced writes
 * - Smart subscriptions with change notifications
 */
export class DynaManager {
  /** List of subscribers */
  private subscribers: SubscribeEntry[] = []

  /** Persist configuration mapped by path */
  private persistMap = new Map<string, PersistConfig>()

  /**
   * Configure persistence behavior for specific paths
   * @param cfgs Array of PersistConfig entries
   */
  configurePersist(cfgs: PersistConfig[]) {
    for (const c of cfgs) this.persistMap.set(c.path, c)
  }

  /**
   * Read a value by path using multi-layer fallback and TTL
   * Fallback order:
   * MemoryLayer -> Redux -> storage layers (local/session/cookie)
   * @param path Target path (optional)
   * @returns Value at path or entire state if path is undefined
   */
  async get(path?: string) {
    if (!path) return store.getState().dyna

    const cfg = this.persistMap.get(path)
    const reduxValue = getByPath(store.getState().dyna, path)

    if (cfg) return await readFromLayers(cfg, reduxValue)
    return reduxValue
  }

  /**
   * Replace the value of a path
   * Dispatches to Redux + MemoryLayer + persistence + notifies subscribers
   * @param path Target path
   * @param value New value
   */
  set(path: string, value: any) {
    store.dispatch(setPath({ path, value }))

    const cfg = this.persistMap.get(path)
    if (cfg) persistToLayers(cfg, value)

    const key = cfg?.key ?? path
    MemoryLayer.set(key, value)

    this.notifySubscribers(path)
  }

  /**
   * Shallow-merge a value with the previous value
   * @param path Target path
   * @param value Partial value to merge
   */
  merge(path: string, value: any) {
    store.dispatch(mergePath({ path, value }))

    const cfg = this.persistMap.get(path)
    const key = cfg?.key ?? path

    const prev = MemoryLayer.get(key) ?? getByPath(store.getState().dyna, path)
    const merged = { ...(prev ?? {}), ...value }
    MemoryLayer.set(key, merged)

    if (cfg) persistToLayers(cfg, merged)

    this.notifySubscribers(path)
  }

  /**
   * Set multiple paths at once
   * @param values Object with key = path and value = new value
   */
  bulkSet(values: Record<string, any>) {
    store.dispatch(reduxBulkSet(values))

    for (const path in values) {
      const cfg = this.persistMap.get(path)
      const key = cfg?.key ?? path
      MemoryLayer.set(key, values[path])
      if (cfg) persistToLayers(cfg, values[path])
    }

    this.notifyAll()
  }

  /**
   * Subscribe to changes of a specific path or the entire state
   * @param cb Callback invoked with the new value
   * @param path Target path (optional)
   * @returns Unsubscribe function
   */
  subscribe(cb: DynaCallback, path?: string) {
    const id = Symbol()
    this.subscribers.push({ id, cb, path, lastValue: undefined })

    // Initial async value emission
    this.get(path).then(val => {
      const sub = this.subscribers.find(s => s.id === id)
      if (sub) { sub.lastValue = val; cb(val) }
    })

    return () => {
      this.subscribers = this.subscribers.filter(s => s.id !== id)
    }
  }

  /**
   * Fully reset the state
   * Redux + MemoryLayer + persisted layers + notify subscribers
   * @param next Optional next state value
   */
  reset(next?: any) {
    store.dispatch(reset(next))
    MemoryLayer.clear()

    for (const [, cfg] of this.persistMap) {
      persistToLayers(cfg, next ? getByPath(next, cfg.path) : undefined)
    }

    this.notifyAll()
  }

  /**
   * Notify subscribers only if the actual value has changed
   * @param path Changed path
   */
  private async notifySubscribers(path: string) {
    for (const s of this.subscribers) {
      if (!s.path || s.path === path) {
        const val = await this.get(s.path)
        if (!deepEqual(val, s.lastValue)) {
          s.lastValue = val
          s.cb(val)
        }
      }
    }
  }

  /**
   * Notify all subscribers
   */
  private async notifyAll() {
    for (const s of this.subscribers) {
      const val = await this.get(s.path)
      if (!deepEqual(val, s.lastValue)) {
        s.lastValue = val
        s.cb(val)
      }
    }
  }
}

/** Singleton instance */
export const DynaMan = new DynaManager()
