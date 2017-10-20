import { easyStore as originalEasyStore } from 'react-easy-state'
import { observe, unobserve, unqueue } from '@nx-js/observer-util'
import { syncStoreWithUrl, syncUrlWithStore } from './url'
import { syncStoreWithHistory, syncHistoryWithStore } from './history'
import { syncStoreWithStorage, syncStorageWithStore } from './storage'
import setupConfig from './setupConfig'

const stores = new Map()
const activeStores = new Map()
const synchronizers = new Map()

export function easyStore (store, config) {
  store = originalEasyStore(store)

  if (config === undefined) {
    return store
  }
  if (typeof config !== 'object' || config === null) {
    throw new TypeError(
      'The second argument must be undefined or a config object.'
    )
  }

  config = setupConfig(config)
  stores.set(store, config)
  return store
}

export function routeParams (params) {
  // distibute the passed params between the stores based on their config keys
  // the url/history/localStorage will update automatically
  stores.forEach((config, store) => {
    for (let key of config.keys) {
      if (key in params) {
        store[key] = params[key]
      }
    }
  })
}

// DELETE THIS LATER
window.observe = () => {
  observe(() => activeStores.forEach((config, store) => console.log('type', store, store.type)))
  observe(() => console.log('PARAMS', getParams()))
  console.log('stores', stores)
  console.log('activeStore', activeStores)
}

export function getParams () {
  const params = {}
  // get params from the passed store or all stores if no store is passed

  // fetch the params from all of the stores and merge them into a single object
  activeStores.forEach((config, store) => {
    for (let key of config.keys) {
      console.log('GET STORE', store, key, store[key])
      params[key] = store[key]
    }
  })
  return params
}

export function activate (store) {
  if (!stores.has(store)) {
    throw new Error('The first argument must be a param synced store.')
  }
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

export function deactivate (store) {
  if (!activeStores.has(store)) {
    return
  }
  activeStores.delete(store)

  const synchronizer = synchronizers.get(store)
  unobserve(synchronizer.storage)
  unobserve(synchronizer.history)
  unobserve(synchronizer.url)
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
