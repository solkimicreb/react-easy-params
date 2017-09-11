import { observable } from '@nx-js/observer-util'
import { expect } from 'chai'
import { easyParams } from 'react-easy-params'

describe('easyParams', () => {
  window.x = 12
  it('should throw when the first parameter is not an observable', () => {
    expect(() => easyParams({}, {})).to.throw(TypeError)
    expect(() => easyParams(null, {})).to.throw(TypeError)
    expect(() => easyParams(undefined, {})).to.throw(TypeError)
    expect(() => easyParams(observable(), {})).to.not.throw()
  })

  it('should throw when the second parameter is not an object', () => {
    expect(() => easyParams(observable(), null)).to.throw(TypeError)
    expect(() => easyParams(observable(), undefined)).to.throw(TypeError)
    expect(() => easyParams(observable(), {})).to.not.throw()
  })

  it('should not allow invalid options in the config object', () => {
    expect(() => easyParams(observable(), { name: 'invalid' })).to.throw()
    expect(() => easyParams(observable(), { name: undefined })).to.throw()
    expect(() => easyParams(observable(), { name: [] })).to.throw()
    expect(() => easyParams(observable(), { name: ['history', 'invalid'] })).to.throw()
    expect(() => easyParams(observable(), { name: 'url' })).to.not.throw()
    expect(() => easyParams(observable(), { name: ['history'] })).to.not.throw()
    expect(() => easyParams(observable(), { name: ['url', 'storage'] })).to.not.throw()
  })

  it('should freeze the passed config object', () => {
    const config = { name: 'url' }
    easyParams(observable(), config)

    expect(() => {
      config.name = 'history'
    }).to.throw()
    expect(() => {
      config.age = 'storage'
    }).to.throw()
  })
})
