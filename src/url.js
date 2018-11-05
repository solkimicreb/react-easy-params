import { observable, observe } from '@nx-js/observer-util'
import scheduler from './scheduler'

export const url = observable(createUrl())

const unWritableKeys = ['origin', 'searchParams']

observe(syncUrl, { scheduler })

function createUrl (href = location.href) {
  const url = new URL(href)
  const ret = {}
  for (const key in url) {
    ret[key] = url[key]
  }
  ret.params = createParams(url.searchParams)
  return ret
}

function createParams (searchParams) {
  /* Convert URLSearchParams object into plain key-value object */
  return Array.from(searchParams.entries()).reduce((params, [key, value]) => ({
    ...params,
    [key]: value
  }), {})
}

function updateParams (params, searchParams) {
  /* Update the URLSearchParams object from plain key-value object */
  for (const key in params) {
    searchParams.set(key, params[key])
  }
}

function updateUrl (oldUrl, href = oldUrl.href) {
  const newUrl = new URL(href)
  for (const key in newUrl) {
    if (unWritableKeys.includes(key)) continue
    newUrl[key] = oldUrl[key]
    /* URL does internal adjustments, like automatically add "#" to .hash (even if the user hadn't) */
    /* So the updated properties need to be copied back for consistency and expected behaviour */
    oldUrl[key] = newUrl[key]
  }
  updateParams(oldUrl.params, newUrl.searchParams)
  return createUrl(newUrl.href)
}

function syncUrl () {
  const newUrl = updateUrl(url)
  history.replaceState(history.state, '', newUrl.href)
}
