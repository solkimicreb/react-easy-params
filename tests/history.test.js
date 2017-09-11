import { observable } from '@nx-js/observer-util'
import { expect } from 'chai'
import { easyParams, routeParams } from 'react-easy-params'
import { nextTick, nextRender, nextTask } from './utils'

describe('history synchronization', () => {
  beforeEach(() => {
    history.replaceState(undefined, '', location.pathname)
  })

  it('should synchronize store properties with the history on store definition', () => {
    const store = observable({ firstName: 'Test', lastName: 'User' })
    easyParams(store, { firstName: 'history', lastName: 'history' })
    expect(history.state).to.eql({ firstName: 'Test', lastName: 'User' })
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

    await nextRender()
    const store = observable({ firstName: 'Test' })
    easyParams(store, { firstName: 'history', lastName: 'history' })
    expect(history.state).to.eql({ firstName: 'Test' })
    expect(history.length).to.equal(startLength + 1)

    await nextRender()
    store.lastName = 'User'
    await nextTick()
    expect(history.state).to.eql({ firstName: 'Test', lastName: 'User' })
    expect(history.length).to.equal(startLength + 2)

    await nextRender()
    store.firstName = 'Other'
    await nextTick()
    expect(history.state).to.eql({ firstName: 'Other', lastName: 'User' })
    expect(history.length).to.equal(startLength + 3)
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
    expect(history.length).to.equal(startLength)

    store.firstName = 'Other'
    await nextTick()
    expect(history.state).to.eql({ firstName: 'Other', lastName: 'User' })
    expect(history.length).to.equal(startLength)
  })

  it('should syncronize on history navigation', async () => {
    const store = observable({ firstName: 'Test' })
    easyParams(store, { firstName: 'history', lastName: 'history' })
    expect(history.state).to.eql({ firstName: 'Test' })

    await nextRender()
    store.lastName = 'User'
    await nextTick()
    expect(history.state).to.eql({ firstName: 'Test', lastName: 'User' })

    await nextRender()
    store.firstName = 'Other'
    await nextTick()
    expect(history.state).to.eql({ firstName: 'Other', lastName: 'User' })

    history.back()
    await nextTask()
    expect(history.state).to.eql({ firstName: 'Test', lastName: 'User' })

    history.back()
    await nextTask()
    expect(history.state).to.eql({ firstName: 'Test' })

    history.forward()
    await nextTask()
    expect(history.state).to.eql({ firstName: 'Test', lastName: 'User' })

    history.forward()
    await nextTask()
    expect(history.state).to.eql({ firstName: 'Other', lastName: 'User' })
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
})
