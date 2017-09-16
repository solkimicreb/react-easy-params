import { observable, observe } from '@nx-js/observer-util'
import { expect } from 'chai'
import { easyParams, getParams } from 'react-easy-params'
import { nextTick } from './utils'

describe('getParams', () => {
  beforeEach(async () => {
    await nextTick()
  })

  it('should throw when the first parameter is not an array', () => {
    expect(() => getParams()).to.throw(TypeError)
    expect(() => getParams({})).to.throw(TypeError)
    expect(() => getParams([])).to.not.throw()
  })

  it('should fetch parameters from stores for the given keys', () => {
    const nameStore = observable({
      name: 'Bob',
      nickName: 'Bobby'
    })
    const date = new Date()
    const dateStore = observable({
      date
    })
    easyParams(nameStore, { name: 'storage', nickName: 'storage' })
    easyParams(dateStore, { date: 'storage' })

    const params = getParams(['name', 'nickName', 'date'])
    expect(params).to.eql({
      name: 'Bob',
      nickName: 'Bobby',
      date
    })
  })

  it('should auto recalculate when used in a reaction', async () => {
    const nameStore = observable({ name: 'Bob' })
    const emailStore = observable({ email: 'bob@gmail.com' })
    easyParams(nameStore, { name: 'storage' })
    easyParams(emailStore, { email: 'storage' })

    let params
    observe(() => (params = getParams(['name', 'email'])))
    expect(params).to.eql({ name: 'Bob', email: 'bob@gmail.com' })

    nameStore.name = 'Dave'
    await nextTick()
    expect(params).to.eql({ name: 'Dave', email: 'bob@gmail.com' })

    emailStore.email = 'dave@hotmail.com'
    await nextTick()
    expect(params).to.eql({ name: 'Dave', email: 'dave@hotmail.com' })
  })
})
