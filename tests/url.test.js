import { observable, observe } from '@nx-js/observer-util'
import { expect } from 'chai'
import { easyParams, routeParams } from 'react-easy-params'
import { nextTick } from './utils'

describe('url synchronization', () => {
  beforeEach(async () => {
    history.replaceState(undefined, '', location.pathname)
    await nextTick()
  })

  it('should synchronize store properties with the url on store definition', () => {
    history.replaceState(undefined, '', '?firstName=User')
    const store = observable({})
    easyParams(store, { firstName: 'url', lastName: 'url' })
    expect(store).to.eql({ firstName: 'User' })
  })

  it('should synchronize store properties with the url on popstate events', () => {
    const store = observable()
    easyParams(store, { firstName: 'url', lastName: 'url' })
    history.replaceState(undefined, '', '?firstName=User')

    window.dispatchEvent(new Event('popstate'))
    expect(store).to.eql({ firstName: 'User' })
  })

  it('should synchronize the url with store properties', async () => {
    const store = observable({ firstName: 'Test' })
    easyParams(store, { firstName: 'url', lastName: 'url' })
    expect(location.search).to.equal('?firstName=Test')

    store.lastName = 'User'
    await nextTick()
    expect(location.search).to.equal('?firstName=Test&lastName=User')

    store.firstName = 'Other'
    await nextTick()
    expect(location.search).to.equal('?firstName=Other&lastName=User')

    store.firstName = undefined
    await nextTick()
    expect(location.search).to.equal('?lastName=User')

    store.lastName = undefined
    await nextTick()
    expect(location.search).to.equal('')
  })

  it('should synchronize store properties and the url on param routing', async () => {
    const store = observable({})
    easyParams(store, { firstName: 'url', lastName: 'url' })

    routeParams({ firstName: 'Such', lastName: 'Bob' })
    await nextTick()
    expect(location.search).to.equal('?firstName=Such&lastName=Bob')
    expect(store).to.eql({ firstName: 'Such', lastName: 'Bob' })
  })

  it('should cast numbers', async () => {
    history.replaceState(undefined, '', '?num=1')
    const store = observable({ num: 10 })
    easyParams(store, { num: 'url' })
    expect(store).to.eql({ num: 1 })

    store.num = 2
    await nextTick()
    expect(location.search).to.eql('?num=2')
  })

  it('should cast booleans', async () => {
    history.replaceState(undefined, '', '?bool=false')
    const store = observable({ bool: true })
    easyParams(store, { bool: 'url' })
    expect(store).to.eql({ bool: false })

    store.bool = true
    await nextTick()
    expect(location.search).to.eql('?bool=true')
  })

  it('should cast dates', async () => {
    let date = new Date()
    history.replaceState(undefined, '', `?date=${date.getTime()}`)
    const store = observable({ date: new Date() })
    easyParams(store, { date: 'url' })
    expect(store).to.eql({ date })

    date = new Date()
    store.date = date
    await nextTick()
    expect(location.search).to.eql(`?date=${date.getTime()}`)
  })

  it('should throw on objects', () => {
    const store = observable({ obj: {} })
    expect(() => easyParams(store, { obj: 'history' })).to.throw()
  })

  it('should encode and decode special characters for the url', async () => {
    history.replaceState(undefined, '', '?code=%3F%26%2B%3D')
    const store = observable()
    easyParams(store, { code: 'url' })
    expect(store).to.eql({ code: '?&+=' })

    store.code = '??=*&'
    await nextTick()
    expect(location.search).to.eql('?code=%3F%3F%3D*%26')
  })

  it('should trigger external reactions on popstate', async () => {
    let dummy
    const person = observable()
    observe(() => (dummy = person.name))
    easyParams(person, { name: 'url' })

    history.replaceState(undefined, '', '?name=Bob')
    window.dispatchEvent(new Event('popstate'))
    await nextTick()
    expect(dummy).to.equal('Bob')
  })
})
