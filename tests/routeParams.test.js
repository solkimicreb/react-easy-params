import { observable } from '@nx-js/observer-util'
import { expect } from 'chai'
import { easyParams, routeParams } from 'react-easy-params'

describe('routeParams', () => {
  it('should throw when the first parameter is not an object', () => {
    expect(() => routeParams(undefined)).to.throw(TypeError)
    expect(() => routeParams(null, {})).to.throw(TypeError)
    expect(() => routeParams({})).to.not.throw()
  })

  it('should distribute parameters between stores', () => {
    const nameStore = observable()
    const dateStore = observable()
    easyParams(nameStore, { name: 'url', nickName: 'url' })
    easyParams(dateStore, { date: 'history' })

    const date = new Date()
    routeParams({ name: 'Bob', date, email: 'bob@gmail.com' })
    expect(nameStore.name).to.eql('Bob')
    expect(dateStore.date).to.eql(date)
  })
})
