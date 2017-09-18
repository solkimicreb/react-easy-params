import { expect } from 'chai'
import { easyStore, routeParams } from 'react-easy-params'
import { nextTick } from './utils'

describe('synchronization priorities', () => {
  beforeEach(async () => {
    history.replaceState(undefined, '', location.pathname)
    localStorage.clear()
    await nextTick()
  })

  it('should favour url before history before storage on page init', async () => {
    localStorage.setItem('name', 'Ann')
    localStorage.setItem('age', 20)
    localStorage.setItem('email', 'ann@gmail.com')
    history.replaceState({ name: 'Dave', age: 29 }, '', '?age=32')

    const store = easyStore(
      {
        name: 'Bob',
        age: 22,
        email: 'bob@gmail.com'
      },
      {
        name: ['storage', 'url', 'history'],
        age: ['url', 'history', 'storage'],
        email: ['history', 'storage', 'url']
      }
    )
    expect(store).to.eql({ name: 'Dave', age: 32, email: 'ann@gmail.com' })

    routeParams({ name: 'Bill', age: 40, email: 'bill@gmail.com' })
    await nextTick()
    expect(store).to.eql({ name: 'Bill', age: 40, email: 'bill@gmail.com' })
    expect(localStorage.getItem('name')).to.equal('Bill')
    expect(localStorage.getItem('age')).to.equal('40')
    expect(localStorage.getItem('email')).to.equal('bill@gmail.com')
    expect(history.state).to.eql({
      name: 'Bill',
      age: 40,
      email: 'bill@gmail.com'
    })
    expect(location.search).to.equal(
      '?age=40&name=Bill&email=bill%40gmail.com'
    )
  })

  it('should favour url before history before storage on popstate event', async () => {
    const store = easyStore(
      { name: 'Bill', age: 60 },
      {
        name: ['storage', 'url', 'history'],
        age: ['url', 'history', 'storage']
      }
    )

    history.replaceState({ name: 'Dave', age: 29 }, '', '?age=32')
    window.dispatchEvent(new Event('popstate'))
    await nextTick()
    expect(store).to.eql({ name: 'Dave', age: 32 })
  })

  it('should synchronize the storage on history navigation with url favored over history', async () => {
    const store = easyStore(
      { name: 'Ann', age: 20 },
      {
        name: ['storage', 'url', 'history'],
        age: ['url', 'history', 'storage']
      }
    )
    expect(store).to.eql({ name: 'Ann', age: 20 })

    history.replaceState({ name: 'Bob', age: 12 }, '', '?name=Dave')
    window.dispatchEvent(new Event('popstate'))
    await nextTick()
    expect(store).to.eql({ name: 'Dave', age: 12 })
    expect(localStorage.getItem('name')).to.equal('Dave')
    expect(localStorage.getItem('age')).to.equal('12')
  })
})
