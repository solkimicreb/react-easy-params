import pushState from 'history-throttler'
import { toStoreType, toWidgetType } from './types'

export function syncHistoryWithStore (config, store, initing) {
  const params = Object.assign({}, history.state)
  let paramsChanged = false

  for (let key in config) {
    if (config[key].includes('history')) {
      const newValue = toWidgetType(store[key], false)
      if (params[key] !== newValue) {
        params[key] = newValue
        paramsChanged = true
      }
    }
  }

  // only add a new history item if some parameters changed and if the store is already inited
  if (initing) {
    history.replaceState(params, '')
  } else if (paramsChanged) {
    // pushState throttles to never add multiple history items between two frames
    pushState(params, '')
  }
}

export function syncStoreWithHistory (config, store) {
  const params = Object.assign({}, history.state)
  for (let key in config) {
    if (config[key].includes('history') && key in params) {
      store[key] = toStoreType(params[key], store[key])
    }
  }
}
