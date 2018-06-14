import { expect } from 'chai'
import { params, setParams, scheduler } from 'react-easy-params'

describe('params synchronization', () => {
  afterEach(async () => {
    setParams({})
    await scheduler.processing()
  })

  it('should initialize from the query params', () => {
    expect(params).to.eql({ page: 12, limit: '' })
    expect(location.search).to.eql('?page=12&limit=%22%22')
  })

  it('should sync the query params with the params object', async () => {
    params.name = 'Ann'
    await scheduler.processing()
    expect(params.name).to.eql('Ann')
    expect(location.search).to.eql('?name=%22Ann%22')

    params.age = 20
    await scheduler.processing()
    expect(params.age).to.eql(20)
    expect(location.search).to.eql('?name=%22Ann%22&age=20')

    delete params.name
    await scheduler.processing()
    expect(params.name).to.eql(undefined)
    expect(location.search).to.eql('?age=20')
  })

  it('setParams should shallow replace params with the passed one', async () => {
    params.age = 44
    await scheduler.processing()
    expect(params).to.eql({
      age: 44
    })
    expect(location.search).to.eql('?age=44')

    setParams({ birth: 1990, name: undefined })
    await scheduler.processing()
    expect(params).to.eql({
      birth: 1990,
      name: undefined
    })
    expect(location.search).to.eql('?birth=1990')
  })
})
