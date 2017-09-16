import { toStoreType, toWidgetType } from './types'

export function syncStorageWithStore (config, store) {
  for (let key of config.storage) {
    if (store[key] === undefined) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, toWidgetType(store[key], true))
    }
  }
}

export function syncStoreWithStorage (config, store) {
  for (let key of config.storage) {
    if (key in localStorage) {
      store[key] = toStoreType(localStorage.getItem(key), store[key])
    }
  }
}
