import { expect } from 'chai'
import { easyStore } from 'react-easy-params'

describe('easyStore', () => {
  it('should throw when the first parameter is not an object', () => {
    expect(() => easyStore(false, {})).to.throw(TypeError)
    expect(() => easyStore(null, {})).to.throw(TypeError)
    expect(() => easyStore(undefined, {})).to.throw(TypeError)
    expect(() => easyStore({}, {})).to.not.throw()
  })

  it('should throw when the second parameter is not an object or undefined', () => {
    expect(() => easyStore({}, true)).to.throw(TypeError)
    expect(() => easyStore({}, null)).to.throw(TypeError)
    expect(() => easyStore({}, undefined)).to.not.throw()
    expect(() => easyStore({}, {})).to.not.throw()
  })

  it('should not allow invalid options in the config object', () => {
    expect(() => easyStore({}, { name: 'invalid' })).to.throw()
    expect(() => easyStore({}, { name: undefined })).to.throw()
    expect(() => easyStore({}, { name: [] })).to.throw()
    expect(() => easyStore({}, { name: ['history', 'invalid'] })).to.throw()
    expect(() => easyStore({}, { name: 'url' })).to.not.throw()
    expect(() => easyStore({}, { name: ['history'] })).to.not.throw()
    expect(() => easyStore({}, { name: ['url', 'storage'] })).to.not.throw()
  })
})
