import { isObservable, observe, unobserve, unqueue } from '@nx-js/observer-util'
import { syncStoreWithUrl, syncUrlWithStore } from './url'
import { syncStoreWithHistory, syncHistoryWithStore } from './history'
import { syncStoreWithStorage, syncStorageWithStore } from './storage'
import setupConfig from './setupConfig'

const stores = new Map()
const activeStores = new Map()
const synchronizers = new Map()

export function easyParams (store, config) {
  if (!isObservable(store)) {
    throw new TypeError(
      'The first argument must be an observable state store.'
    )
  }
  if (typeof config !== 'object' || config === null) {
    throw new TypeError('The second argument must be a config object.')
  }
  config = setupConfig(config)
  stores.set(store, config)
  activate(store)
}

export function routeParams (params) {
  if (typeof params !== 'object' || params === null) {
    throw new TypeError('The first argument must be a params object.')
  }

  // distibute the passed params between the stores based on their config keys
  // the url/history/localStorage will update automatically because of the reactions
  activeStores.forEach((config, store) => {
    for (let key of config.keys) {
      if (key in params) {
        store[key] = params[key]
      }
    }
  })
}

export function getParams () {
  const params = {}

  // fetch the params from all of the stores and merge them into a single object
  activeStores.forEach((config, store) => {
    for (let key of config.keys) {
      params[key] = store[key]
    }
  })
  return params
}

function activate (store) {
  if (activeStores.has(store)) {
    return
  }
  const config = stores.get(store)
  activeStores.set(store, config)

  // init the store based on the localStorage/url/history
  syncStoreWithStorage(config, store)
  syncStoreWithHistory(config, store)
  syncStoreWithUrl(config, store)

  let initing = true
  // these run now once and will automatically rerun when the store changes
  synchronizers.set(store, {
    // history sync must come before url sync as it can push a new history item
    // the new item must be pushed asap, so that the later replaceStates mutate it rather than the old one
    storage: observe(() => syncStorageWithStore(config, store)),
    history: observe(() => syncHistoryWithStore(config, store, initing)),
    url: observe(() => syncUrlWithStore(config, store))
  })
  initing = false
}

function deactivate (store) {
  if (!activeStores.has(store)) {
    return
  }
  activeStores.delete(store)

  const sync = synchronizers.get(store)
  unobserve(sync.storage)
  unobserve(sync.history)
  unobserve(sync.url)
  synchronizers.delete(store)
}

window.addEventListener('popstate', () => {
  activeStores.forEach(syncStoreWithHistory)
  activeStores.forEach(syncStoreWithUrl)

  // the url/history change triggered the store update
  // there is no need to update the url/history again
  synchronizers.forEach(unqueuePopstateSynchronizer)
})

// the localStorage should still be synchronized, as it was not the source of the change
// it is not unqueued from the reaction because of this
function unqueuePopstateSynchronizer (synchronizer) {
  unqueue(synchronizer.url)
  unqueue(synchronizer.history)
}
