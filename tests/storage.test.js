import { observe } from '@nx-js/observer-util'
import { expect } from 'chai'
import { storage, setStorage, scheduler } from 'react-easy-params'

const STORAGE_NAME = 'REACT_EASY_STORAGE'

describe('storage synchronization', () => {
  afterEach(async () => {
    setStorage({})
    await scheduler.processing()
  })

  it('should initialize from localStorage', () => {
    expect(JSON.parse(localStorage.getItem(STORAGE_NAME))).to.eql({ initial: true })
    expect(storage).to.eql({ initial: true })
  })

  it('should sync the localStorage with the storage object', async () => {
    storage.user = {
      name: 'Bob',
      age: 34
    }
    await scheduler.processing()
    expect(storage.user).to.eql({
      name: 'Bob',
      age: 34
    })
    expect(JSON.parse(localStorage.getItem(STORAGE_NAME))).to.eql({
      user: {
        name: 'Bob',
        age: 34
      }
    })

    delete storage.user.name
    await scheduler.processing()
    expect(storage.user).to.eql({
      age: 34
    })
    expect(JSON.parse(localStorage.getItem(STORAGE_NAME))).to.eql({
      user: { age: 34 }
    })
  })

  it('setStorage should shallow replace storage with the passed one', async () => {
    storage.user = {
      name: 'Bob',
      age: 34
    }
    await scheduler.processing()
    expect(storage.user).to.eql({
      name: 'Bob',
      age: 34
    })
    expect(JSON.parse(localStorage.getItem(STORAGE_NAME))).to.eql({
      user: {
        name: 'Bob',
        age: 34
      }
    })

    setStorage({ userLoaded: false })
    await scheduler.processing()
    expect(storage).to.eql({
      userLoaded: false
    })
    expect(JSON.parse(localStorage.getItem(STORAGE_NAME))).to.eql({
      userLoaded: false
    })
  })
})
