import { toStoreType, toWidgetType } from './types'

export function syncStorageWithStore (config, store) {
  for (let key in config) {
    if (config[key].includes('storage')) {
      if (store[key] === undefined) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, toWidgetType(store[key], true))
      }
    }
  }
}

export function syncStoreWithStorage (config, store) {
  store = store.$raw
  for (let key in config) {
    if (config[key].includes('storage') && (key in localStorage)) {
      store[key] = toStoreType(localStorage.getItem(key), store[key])
    }
  }
}
