import { observe } from '@nx-js/observer-util'
import { expect } from 'chai'
import { easyStore, getParams } from 'react-easy-params'
import { nextTick } from './utils'

describe('getParams', () => {
  let nameStore, emailStore

  before(() => {
    nameStore = easyStore({ name: 'Bob' }, { name: 'storage' })
    emailStore = easyStore({ email: 'bob@gmail.com' }, { email: 'storage' })
  })

  beforeEach(async () => {
    await nextTick()
  })

  it('should fetch parameters from stores', () => {
    const params = getParams()
    expect(params).to.eql({
      name: 'Bob',
      email: 'bob@gmail.com'
    })
  })

  it('should auto recalculate when used in a reaction', async () => {
    let params
    observe(() => (params = getParams()))
    expect(params).to.eql({ name: 'Bob', email: 'bob@gmail.com' })

    nameStore.name = 'Dave'
    await nextTick()
    expect(params).to.eql({ name: 'Dave', email: 'bob@gmail.com' })

    emailStore.email = 'dave@hotmail.com'
    await nextTick()
    expect(params).to.eql({ name: 'Dave', email: 'dave@hotmail.com' })
  })
})
