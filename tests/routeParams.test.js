import { observe } from '@nx-js/observer-util'
import { expect } from 'chai'
import { easyStore, routeParams } from 'react-easy-params'
import { nextTick } from './utils'

describe('routeParams', () => {
  beforeEach(async () => {
    await nextTick()
  })

  it('should throw when the first parameter is not an object', () => {
    expect(() => routeParams(undefined)).to.throw(TypeError)
    expect(() => routeParams(null)).to.throw(TypeError)
    expect(() => routeParams({})).to.not.throw()
  })

  it('should distribute parameters between stores', () => {
    const nameStore = easyStore({}, { name: 'storage', nickName: 'storage' })
    const dateStore = easyStore({}, { date: 'storage' })

    const date = new Date()
    routeParams({ name: 'Bob', date, email: 'bob@gmail.com' })
    expect(nameStore.name).to.eql('Bob')
    expect(dateStore.date).to.eql(date)
  })

  it('should trigger external reactions', async () => {
    let dummy
    const person = easyStore({}, { name: 'storage' })
    observe(() => (dummy = person.name))

    routeParams({ name: 'Bob' })
    await nextTick()
    expect(dummy).to.equal('Bob')
  })
})
