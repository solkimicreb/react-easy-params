import { nextTick } from '@nx-js/observer-util'

export { nextTick }

export function nextRender () {
  return new Promise(requestAnimationFrame)
}
