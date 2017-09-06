import pushState from 'history-throttler'
import { toStoreType, toWidgetType } from './types'

export function syncHistoryWithStore (config, store) {
  let historyChanged = false
  const params = Object.assign({}, history.state)
  for (let key in config) {
    if (config[key].includes('history')) {
      const newValue = toWidgetType(store[key], false)
      if (params[key] !== newValue) {
        params[key] = newValue
        historyChanged = true
      }
    }
  }
  if (historyChanged) {
    pushState(params, '', createUrl())
  } else {
    history.replaceState(params, '', createUrl())
  }
}

export function syncStoreWithHistory (config, store) {
  store = store.$raw
  const params = Object.assign({}, history.state)
  for (let key in config) {
    if (config[key].includes('history') && (key in params)) {
      store[key] = toStoreType(params[key], store[key])
    }
  }
}

function createUrl () {
  return location.pathname + location.search + location.hash
}
