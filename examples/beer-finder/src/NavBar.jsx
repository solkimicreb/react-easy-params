import React from 'react'
import { view } from 'react-easy-state'
import { params } from 'react-easy-params'
import SearchBar from 'material-ui-search-bar'
import { LinearProgress } from 'material-ui/Progress'
import appStore from './appStore'

function onChange (filter) {
  params.filter = filter
}

function onRequestSearch (filter) {
  appStore.fetchBeers(filter)
}

export default view(() => (
  <div className='searchbar'>
    <SearchBar
      onChange={onChange}
      onRequestSearch={onRequestSearch}
      value={params.filter}
      placeholder='Some food ...'
    />
    {appStore.isLoading && <LinearProgress />}
  </div>
))