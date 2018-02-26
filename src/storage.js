import { observable, observe } from '@nx-js/observer-util'
import scheduler from './scheduler'

const STORAGE_NAME = 'REACT_EASY_STORAGE'
export const storage = observable(
  JSON.parse(localStorage.getItem(STORAGE_NAME)) || {}
)

export function setStorage (newStorage) {
  for (let key of Object.keys(storage)) {
    delete storage[key]
  }
  Object.assign(storage, newStorage)
}

function syncStorage () {
  localStorage.setItem(STORAGE_NAME, JSON.stringify(storage))
}

observe(syncStorage, { scheduler })
