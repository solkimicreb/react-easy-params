import { store } from 'react-easy-state'
import { params } from 'react-easy-params'
import * as api from './api'

// use 'appStore' instead of 'this' in the store methods to make them passable as callbacks
const appStore = store({
  beers: [],
  async fetchBeers () {
    appStore.isLoading = true
    appStore.beers = await api.fetchBeers(params.filter)
    appStore.isLoading = false
  }
})
appStore.fetchBeers()

export default appStore
