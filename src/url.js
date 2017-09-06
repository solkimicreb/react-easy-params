import { toStoreType, toWidgetType } from './types'
import { toQuery, toParams } from './searchParams'

export function syncUrlWithStore (config, store) {
  const params = toParams(location.search)
  for (let key in config) {
    if (config[key].includes('url')) {
      params[key] = toWidgetType(store[key], false)
    }
  }
  history.replaceState(history.state, '', createUrl(params))
}

export function syncStoreWithUrl (config, store) {
  store = store.$raw
  const params = toParams(location.search)
  for (let key in config) {
    if (config[key].includes('url') && (key in params)) {
      store[key] = toStoreType(params[key], store[key])
    }
  }
}

function createUrl (params) {
  return location.pathname + toQuery(params)
}
