import { isObservable, observe } from '@nx-js/observer-util'
import { syncStoreWithUrl, syncUrlWithStore } from './url'
import { syncStoreWithHistory, syncHistoryWithStore } from './history'
import { syncStoreWithStorage, syncStorageWithStore } from './storage'
import validateConfig from './validateConfig'

const stores = new Map()

export function easyParams (store, config) {
  if (!isObservable(store)) {
    throw new TypeError('The first argument must be an observable state store.')
  }
  if (typeof config !== 'object' || config === null) {
    throw new TypeError('The second argument must be a config object.')
  }
  validateConfig(config)
  stores.set(store, config)
  sync(config, store)
}

export function routeParams (params) {
  if (typeof params !== 'object' || params === null) {
    throw new TypeError('The first argument must be a params object.')
  }

  stores.forEach((config, store) => {
    for (let key in config) {
      if (key in params) {
        store[key] = params[key]
      }
    }
  })
}

function sync (config, store) {
  syncStoreWithStorage(config, store)
  syncStoreWithHistory(config, store)
  syncStoreWithUrl(config, store)

  observe(() => syncUrlWithStore(config, store))
  observe(() => syncHistoryWithStore(config, store))
  observe(() => syncStorageWithStore(config, store))
}

window.addEventListener('popstate', () => {
  stores.forEach(syncStoreWithHistory)
  stores.forEach(syncStoreWithUrl)

  stores.forEach(syncStorageWithStore)
})
