import React from 'react'
import { view } from 'react-easy-state'
import { params, path } from 'react-easy-params'

const updateParam = ev => (params.name = ev.target.value)
const updatePath = ev => (path[0] = ev.target.value)

export default view(() => (
  <div>
    <div>
      Path: <input onChange={updatePath} value={path[0]} />
    </div>
    <div>
      Param: <input onChange={updateParam} value={params.name} />
    </div>
  </div>
))
