import { toStoreType, toWidgetType } from './types'
import { toQuery, toParams } from './searchParams'

export function syncUrlWithStore (config, store) {
  const params = toParams(location.search)
  let paramsChanged = false

  for (let key of config.url) {
    const newValue = toWidgetType(store[key], false)
    if (params[key] !== newValue) {
      params[key] = newValue
      paramsChanged = true
    }
  }

  // replaceState is expensive, only do it when it is necessary
  if (paramsChanged) {
    history.replaceState(history.state, '', createUrl(params))
  }
}

export function syncStoreWithUrl (config, store) {
  const params = toParams(location.search)
  for (let key of config.url) {
    if (key in params) {
      store[key] = toStoreType(params[key], store[key])
    }
  }
}

function createUrl (params) {
  return location.pathname + toQuery(params) + location.hash
}
