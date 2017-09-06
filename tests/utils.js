export function nextTick () {
  return Promise.resolve()
}

export function nextRender () {
  return new Promise(requestAnimationFrame)
}

export function nextTask () {
  return new Promise(setTimeout)
}
