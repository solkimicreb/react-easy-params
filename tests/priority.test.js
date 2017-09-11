import { observable } from '@nx-js/observer-util'
import { expect } from 'chai'
import { easyParams, routeParams } from 'react-easy-params'
import { nextTick, nextTask } from './utils'

describe('synchronization priorities', () => {
  beforeEach(() => {
    localStorage.clear()
    history.replaceState(undefined, '', location.pathname)
  })

  it('should favour url before history before storage', async () => {
    localStorage.setItem('name', 'Ann')
    localStorage.setItem('age', 20)
    localStorage.setItem('email', 'ann@gmail.com')
    history.replaceState({ name: 'Dave', age: 29 }, '', '?age=32')

    const store = observable({
      name: 'Bob',
      age: 22,
      email: 'bob@gmail.com'
    })
    easyParams(store, {
      name: ['storage', 'url', 'history'],
      age: ['url', 'history', 'storage'],
      email: ['history', 'storage', 'url']
    })
    expect(store).to.eql({ name: 'Dave', age: 32, email: 'ann@gmail.com' })

    routeParams({ name: 'Bill', age: 40, email: 'bill@gmail.com' })
    await nextTick()
    expect(store).to.eql({ name: 'Bill', age: 40, email: 'bill@gmail.com' })
    expect(localStorage.getItem('name')).to.equal('Bill')
    expect(localStorage.getItem('age')).to.equal('40')
    expect(localStorage.getItem('email')).to.equal('bill@gmail.com')
    expect(history.state).to.eql({ name: 'Bill', age: 40, email: 'bill@gmail.com' })
    expect(location.search).to.equal('?age=40&name=Bill&email=bill%40gmail.com')
  })

  it('should synchronize the storage on history navigation with url favored over history', async () => {
    const store = observable({ name: 'Ann', age: 20 })
    easyParams(store, {
      name: ['storage', 'url', 'history'],
      age: ['url', 'history', 'storage']
    })
    expect(store).to.eql({ name: 'Ann', age: 20 })

    history.replaceState({ name: 'Bob', age: 12 }, '', '?name=Dave')
    history.pushState(undefined, '', location.pathname)
    history.back()
    await nextTask()
    expect(store).to.eql({ name: 'Dave', age: 12 })
    expect(localStorage.getItem('name')).to.equal('Dave')
    expect(localStorage.getItem('age')).to.equal('12')
  })
})
