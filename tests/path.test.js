import { expect } from 'chai'
import { setPath, path, scheduler } from 'react-easy-params'

describe('path synchronization', () => {
  afterEach(async () => {
    setPath([])
    await scheduler.processing()
  })

  it('should initialize from the url pathname', () => {
    expect(location.pathname).to.eql('/items')
    expect(path).to.eql(['items'])
  })

  it('should sync the url pathname with the path array', async () => {
    path[0] = 'user'
    await scheduler.processing()
    expect(path).to.eql(['user'])
    expect(location.pathname).to.eql('/user')

    path.push('profile')
    await scheduler.processing()
    expect(path).to.eql(['user', 'profile'])
    expect(location.pathname).to.eql('/user/profile')

    path.shift()
    await scheduler.processing()
    expect(path).to.eql(['profile'])
    expect(location.pathname).to.eql('/profile')
  })

  it('setPath should shallow replace path with the passed one', async () => {
    path.push('user')
    await scheduler.processing()
    expect(path).to.eql(['user'])
    expect(location.pathname).to.eql('/user')

    setPath(['profile'])
    await scheduler.processing()
    expect(path).to.eql(['profile'])
    expect(location.pathname).to.eql('/profile')
  })
})
