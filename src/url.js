import { observable, observe } from '@nx-js/observer-util'
import scheduler from './scheduler'
import { toQuery, toParams, toPathArray, toPathString } from './utils'

export const params = observable(toParams(location.search))
export const path = observable(toPathArray(location.pathname))

export function setParams (newParams) {
  for (let key of Object.keys(params)) {
    delete params[key]
  }
  Object.assign(params, newParams)
}

export function setPath (newPath) {
  path.length = 0
  path.push(...newPath)
}

function syncUrl () {
  const url = toPathString(path) + toQuery(params) + location.hash
  history.replaceState(history.state, '', url)
}

observe(syncUrl, { scheduler })
