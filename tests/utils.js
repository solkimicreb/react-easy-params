import ReactDOM from 'react-dom'
import React, { Component } from 'react'
export { nextTick } from '@nx-js/observer-util'

export function nextRender () {
  return new Promise(requestAnimationFrame)
}

export function createTestRoot (Comp) {
  if (!window.document.body) {
    window.document.body = document.createElement('body')
  }
  const testRoot = document.createElement('div')
  document.body.appendChild(testRoot)
  
  return new Promise(resolve => reactDOM.render(<Comp />, testRoot, resolve))
}
