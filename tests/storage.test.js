import { observe } from '@nx-js/observer-util'
import { expect } from 'chai'
import { easyStore, routeParams } from 'react-easy-params'
import { nextTick } from './utils'

describe('storage synchronization', () => {
  beforeEach(async () => {
    localStorage.clear()
    await nextTick()
  })

  it('should synchronize store properties with the storage on store definition', () => {
    localStorage.setItem('firstName', 'Bob')
    const store = easyStore({}, { firstName: 'storage', lastName: 'storage' })
    expect(store).to.eql({ firstName: 'Bob' })
  })

  it('should synchronize the storage with store properties', async () => {
    const store = easyStore(
      { firstName: 'Test' },
      { firstName: 'storage', lastName: 'storage' }
    )
    expect(localStorage.getItem('firstName')).to.equal('Test')

    store.lastName = 'User'
    await nextTick()
    expect(localStorage.getItem('lastName')).to.equal('User')

    store.firstName = 'Other'
    await nextTick()
    expect(localStorage.getItem('firstName')).to.equal('Other')

    store.firstName = undefined
    await nextTick()
    expect(localStorage.getItem('firstName')).to.equal(null)
  })

  it('should synchronize store properties and the storage on param routing', async () => {
    const store = easyStore({}, { firstName: 'storage', lastName: 'storage' })

    routeParams({ firstName: 'Such', lastName: 'Bob' })
    await nextTick()
    expect(store).to.eql({ firstName: 'Such', lastName: 'Bob' })
    expect(localStorage.getItem('firstName')).to.equal('Such')
    expect(localStorage.getItem('lastName')).to.equal('Bob')
  })

  it('should cast numbers', async () => {
    localStorage.setItem('num', 1)
    const store = easyStore({ num: 10 }, { num: 'storage' })
    expect(store).to.eql({ num: 1 })

    store.num = 2
    await nextTick()
    expect(localStorage.getItem('num')).to.equal('2')
  })

  it('should cast booleans', async () => {
    localStorage.setItem('bool', false)
    const store = easyStore({ bool: true }, { bool: 'storage' })
    expect(store).to.eql({ bool: false })

    store.bool = true
    await nextTick()
    expect(localStorage.getItem('bool')).to.eql('true')
  })

  it('should cast dates', async () => {
    let date = new Date()
    localStorage.setItem('date', date.getTime())
    const store = easyStore({ date: new Date() }, { date: 'storage' })
    expect(store).to.eql({ date })

    date = new Date()
    store.date = date
    await nextTick()
    expect(localStorage.getItem('date')).to.equal(String(date.getTime()))
  })

  it('should cast objects', async () => {
    localStorage.setItem('name', '{"first":"Ann","last":"Smith"}')
    const store = easyStore({ name: {} }, { name: 'storage' })
    expect(store).to.eql({ name: { first: 'Ann', last: 'Smith' } })

    store.name = { first: 'Bob' }
    await nextTick()
    expect(localStorage.getItem('name')).to.equal('{"first":"Bob"}')
  })

  it('should update the storage in popstate events', async () => {
    let dummy
    const person = easyStore({}, { name: ['storage', 'url'] })
    observe(() => (dummy = person.name))

    history.replaceState(undefined, '', '?name=Bob')
    window.dispatchEvent(new Event('popstate'))
    await nextTick()
    expect(dummy).to.equal('Bob')
  })
})
