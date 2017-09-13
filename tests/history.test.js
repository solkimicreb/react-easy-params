import { observable, observe } from '@nx-js/observer-util'
import { expect } from 'chai'
import { easyParams, routeParams } from 'react-easy-params'
import { nextTick, nextRender } from './utils'

describe('history synchronization', () => {
  beforeEach(async () => {
    history.replaceState(undefined, '', location.pathname)
    await nextRender()
  })

  it('should synchronize store properties with the history on store definition', () => {
    const store = observable({ firstName: 'Test', lastName: 'User' })
    easyParams(store, { firstName: 'history', lastName: 'history' })
    expect(history.state).to.eql({ firstName: 'Test', lastName: 'User' })
  })

  it('should synchronize store properties with the history on popstate events', () => {
    const store = observable()
    easyParams(store, { firstName: 'history', lastName: 'history' })
    history.replaceState(
      { firstName: 'Bob', lastName: 'Smith' },
      '',
      location.pathname
    )

    window.dispatchEvent(new Event('popstate'))
    expect(store).to.eql({ firstName: 'Bob', lastName: 'Smith' })
  })

  it('should synchronize the history with store properties', async () => {
    const store = observable({ firstName: 'Test' })
    easyParams(store, { firstName: 'history', lastName: 'history' })
    expect(history.state).to.eql({ firstName: 'Test' })

    store.lastName = 'User'
    await nextTick()
    expect(history.state).to.eql({ firstName: 'Test', lastName: 'User' })

    store.firstName = 'Other'
    await nextTick()
    expect(history.state).to.eql({ firstName: 'Other', lastName: 'User' })
  })

  it('should synchronize store properties and the history on param routing', async () => {
    const store = observable({})
    easyParams(store, { firstName: 'history', lastName: 'history' })

    routeParams({ firstName: 'Such', lastName: 'Bob' })
    await nextTick()
    expect(history.state).to.eql({ firstName: 'Such', lastName: 'Bob' })
    expect(store).to.eql({ firstName: 'Such', lastName: 'Bob' })
  })

  it('should add new history items when neccessary', async () => {
    const startLength = history.length

    const store = observable({ firstName: 'Test' })
    easyParams(store, { firstName: 'history', lastName: 'history' })
    expect(history.state).to.eql({ firstName: 'Test' })
    expect(history.length).to.equal(startLength)

    await nextRender()
    store.lastName = 'User'
    await nextTick()
    expect(history.state).to.eql({ firstName: 'Test', lastName: 'User' })
    expect(history.length).to.equal(startLength + 1)

    await nextRender()
    store.firstName = 'Other'
    await nextTick()
    expect(history.state).to.eql({ firstName: 'Other', lastName: 'User' })
    expect(history.length).to.equal(startLength + 2)
  })

  it('should not add multiple history items between two frames', async () => {
    const startLength = history.length

    const store = observable({ firstName: 'Test' })
    easyParams(store, { firstName: 'history', lastName: 'history' })
    expect(history.state).to.eql({ firstName: 'Test' })
    expect(history.length).to.equal(startLength)

    store.lastName = 'User'
    await nextTick()
    expect(history.state).to.eql({ firstName: 'Test', lastName: 'User' })
    expect(history.length).to.equal(startLength + 1)

    store.firstName = 'Other'
    await nextTick()
    expect(history.state).to.eql({ firstName: 'Other', lastName: 'User' })
    expect(history.length).to.equal(startLength + 1)
  })

  it('should cast dates', async () => {
    let date = new Date()
    history.replaceState({ date: date.getTime() }, '', location.pathname)
    const store = observable({ date: new Date() })
    easyParams(store, { date: 'history' })
    expect(store).to.eql({ date })

    date = new Date()
    store.date = date
    await nextTick()
    expect(history.state).to.eql({ date: date.getTime() })
  })

  it('should throw on objects', () => {
    const store = observable({ obj: {} })
    expect(() => easyParams(store, { obj: 'history' })).to.throw()
  })

  it('should trigger external reactions on popstate', async () => {
    let dummy
    const person = observable()
    observe(() => (dummy = person.name))
    easyParams(person, { name: 'history' })

    history.replaceState({ name: 'Bob' }, '', location.pathname)
    window.dispatchEvent(new Event('popstate'))
    await nextTick()
    expect(dummy).to.equal('Bob')
  })
})
