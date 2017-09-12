import { isObservable, observe, unqueue } from '@nx-js/observer-util'
import { syncStoreWithUrl, syncUrlWithStore } from './url'
import { syncStoreWithHistory, syncHistoryWithStore } from './history'
import { syncStoreWithStorage, syncStorageWithStore } from './storage'
import validateConfig from './validateConfig'

const stores = new Map()
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
  validateConfig(config)
  stores.set(store, config)
  sync(config, store)
}

export function routeParams (params) {
  if (typeof params !== 'object' || params === null) {
    throw new TypeError('The first argument must be a params object.')
  }

  // distibute the passed params between the stores based on their config keys
  // the url/history/localStorage will update automatically because of the reactions
  stores.forEach((config, store) => {
    for (let key in config) {
      if (key in params) {
        store[key] = params[key]
      }
    }
  })
}

function sync (config, store) {
  // init the store based on the localStorage/url/history
  syncStoreWithStorage(config, store)
  syncStoreWithHistory(config, store)
  syncStoreWithUrl(config, store)

  // these run now once and will automatically rerun when the store changes
  synchronizers.set(store, {
    url: observe(() => syncUrlWithStore(config, store)),
    history: observe(() => syncHistoryWithStore(config, store)),
    storage: observe(() => syncStorageWithStore(config, store))
  })
}

window.addEventListener('popstate', () => {
  // history sync must be the first as it can push a new history item
  // the new item must be pushed asap, so that the later replaceStates mutate it rather than the old one
  stores.forEach(syncStoreWithHistory)
  stores.forEach(syncStoreWithUrl)

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