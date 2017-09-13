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
  // only add a new history item if some parameters changed
  // pushState throttles to never add multiple history items between two frames
  if (historyChanged) {
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
