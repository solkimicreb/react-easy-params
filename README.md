# React Easy Params

Auto synchronize your state with the LocalStorage and URL query parameters. Works best together with [React Easy State](https://github.com/solkimicreb/react-easy-state).

[![Build](https://img.shields.io/circleci/project/github/solkimicreb/react-easy-params/master.svg)](https://circleci.com/gh/solkimicreb/react-easy-params/tree/master) [![Coverage Status](https://coveralls.io/repos/github/solkimicreb/react-easy-params/badge.svg)](https://coveralls.io/github/solkimicreb/react-easy-params) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Package size](http://img.badgesize.io/https://unpkg.com/react-easy-params/dist/umd.es6.min.js?compression=gzip&label=minzip_size)](https://unpkg.com/react-easy-params/dist/umd.es6.js)  [![Version](https://img.shields.io/npm/v/react-easy-params.svg)](https://www.npmjs.com/package/react-easy-params) [![dependencies Status](https://david-dm.org/solkimicreb/react-easy-params/status.svg)](https://david-dm.org/solkimicreb/react-easy-params) [![License](https://img.shields.io/npm/l/react-easy-params.svg)](https://www.npmjs.com/package/react-easy-params)

<a href="#platform-support"><img src="images/browser_support.png" alt="Browser support" width="400px" /></a>

<details>
<summary><strong>Table of Contents</strong></summary>
<!-- Do not edit the Table of Contents, instead regenerate with `npm run build-toc` -->

<!-- toc -->

* [Installation](#installation)
* [Usage](#usage)
  + [easyParams](#easyparams)
  + [routeParams](#routeparams)
  + [getParams](#getparams)
* [Examples with live demos](#examples-with-live-demos)
* [Platform support](#platform-support)
* [Alternative builds](#alternative-builds)
* [Contributing](#contributing)

<!-- tocstop -->

</details>

## Introduction

Easy Params is a tool for **small apps - without client-side routing**. It exposes two objects and an array.

- The `params` object is reflected in the URL query parameters.
- The `path` array is reflected in the URL pathname.
- The `storage` object is persisted in the localStorage.

```js
import React from 'react'
import { view } from 'react-easy-state'
import { params, path } from 'react-easy-params'

const updateParam = ev => params.name = ev.target.value
const updatePath = ev => path[0] = ev.target.value

export default view(() =>
  <div>
    <div>Path: <input onChange={updatePath} value={path[0]} /></div>
    <div>Param: <input onChange={updateParam} value={params.name} /></div>
  </div>
)
```

<img src="images/param_code.png" alt="Synchronization Demo" width="55%" min-width="450px" /><img src="images/param_sync.gif" alt="Synchronization Demo" width="40%" min-width="350px" align="right" />

This is enough for it to automatically update your views when needed - no matter how exotically you mutate your state stores. With this freedom you can invent and use your personal favorite state management patterns.

## Installation

Easy Params is built on top of the [React Easy State](https://github.com/solkimicreb/react-easy-state) state management library.  Install them together for the best experience.

`npm install react-easy-params react-easy-state`

## Usage

Easy Params consists of two functions:

- `easyParams` sets up two-way synchronization between your state stores and the URL, browser history and LocalStorage.

- `routeParams` replaces the current parameters with new ones and updates your state stores, the URL, the browser history and the LocalStorage to reflect this.

- `getParams` collects the current parameters from the state stores for the passed parameter keys.

### easyParams

`easyParams(store, config)` sets up the synchronization between the passed store and the URL, history and LocalStorage - based on the passed config object. You can use it as below.

1. Create a reactive state store with [easyStore from React Easy State](https://github.com/solkimicreb/react-easy-state#easystore).

2. Select a set of top-level properties from your store and set up declarative two-way synchronization for them with `easyParams`.

```js
import { easyStore } from 'react-easy-state'
import { easyParams } from 'react-easy-params'

const store = easyStore({
  name: 'Bob'
})

// store.name will be two-way synchronized with the url
// and a new history item will be added whenever store.name changes
easyParams(store, {
  name: ['url', 'history']
})

export default store
```

3. Use the state store in your components. Learn more about this in [React Easy State](https://github.com/solkimicreb/react-easy-state).

```js
import React, { Component } from 'react'
import { easyComp } from 'react-easy-state'
import store from './store'

class Hello extends Component {
  onChange (ev) {
    store.name = ev.target.value  
  }

  render () {
    return (
      <div>
        <input value={store.name} onChange={this.onChange} />
        <div>Hello {store.name}!</div>
      </div>
    )
  }
}

export default easyComp(Hello)
```

4. The view, the URL and the browser history will be auto-synchronized on user input, browser navigation and page shares - for example.

`easyParams(store, config)` requires two parameters. A store - returned by `easyStore` - and a config object. The config object must have the following structure.

```js
easyParams(store, {
  prop1: 'url',
  prop2: ['url', 'history', 'storage']
})
```

`prop1` and `prop2` are properties of the store - which will be two-way synchronized with the URL, history and LocalStorage. Config values for properties the must be one of: `url`, `history` and `storage` - or an array of them in any combination. The order inside the array doesn't matter.

- `url` two-synchronizes the store property with the URL query string. The store property can be a `string`, `number`, `boolean` or `Date` instance.

- `history` adds a new history item when the store property changes. Only one history item is added between two frames and history items are never added before the page fully loads. The store property can be a `string`, `number`, `boolean` or `Date` instance.

- `storage` two-synchronizes the store property with the LocalStorage. The store property can be a `string`, `number`, `boolean`, `Date` instance, `array` or `object`.

The URL query and LocalStorage stores everything as strings. The type of store properties are inferred from their current type - and casted to match them - on synchronization.

### routeParams

`routeParams(obj)` distributes the passed parameters between the stores - based on their `easyParams` configs - and updates the URL, history and LocalStorage to match them.

```js
import { easyStore } from 'react-easy-state'
import { easyParams, routeParams } from 'react-easy-params'

const owner = easyStore({
  name: 'Bob'
})
const dog = easyStore({
  breed: 'Bulldog'
})
easyParams(owner, {
  name: ['url', 'history']
})
easyParams(dog, {
  breed: 'url'
})

// this sets owner.name to 'Dave' and dog.breed to 'Pug',
// updates the url query to '?name=Dave&breed=Pug'
// and adds a new history item, because 'name' changed
routeParams({
  name: 'Dave',
  breed: 'Pug'
})
```

This is a low level function, you probably won't need to use it in your apps.

### getParams

`const params = getParams(array)` collects the parameters from the state stores for the passed array of keys and merges them in a single object.

```js
import { easyStore } from 'react-easy-state'
import { easyParams, getParams } from 'react-easy-params'

const owner = easyStore({
  name: 'Bob'
})
const dog = easyStore({
  breed: 'Bulldog'
})

easyParams(owner, {
  name: ['url', 'history']
})
easyParams(dog, {
  breed: 'url'
})

// this returns { owner: 'Bob', breed: 'Bulldog' }
const params = getParams(['owner', 'breed'])
```

This is a low level function, you probably won't need to use it in your apps.

## Examples with live demos

- [TodoMVC](https://solkimicreb.github.io/react-easy-params/examples/todoMVC/dist) ([source](/examples/todoMVC/))

## Platform support

- Node: 6 and above
- Chrome: 49 and above
- Firefox: 38 and above
- Safari: 10 and above
- Edge: 12 and above
- Opera: 36 and above
- React native is not yet supported
- IE is not supported

## Alternative builds

This library detects if you use ES6 or commonJS modules and serve the right format to you. The exposed bundles are transpiled to ES5 to support common tools - like UglifyJS minifying. If you would like a finer control over the provided build, you can specify them in your imports.

- `react-easy-params/dist/es.es6.js` exposes an ES6 build with ES6 modules.
- `react-easy-params/dist/es.es5.js` exposes an ES5 build with ES6 modules.
- `react-easy-params/dist/cjs.es6.js` exposes an ES6 build with commonJS modules.
- `react-easy-params/dist/cjs.es5.js` exposes an ES5 build with commonJS modules.

If you use a bundler, set up an alias for `react-easy-params` to point to your desired build. You can learn how to do it with webpack [here](https://webpack.js.org/configuration/resolve/#resolve-alias) and with rollup [here](https://github.com/rollup/rollup-plugin-alias#usage).

## Contributing

Contributions are always welcome. Just send a PR against the master branch or open a new issue. Please make sure that the tests and the linter pass and the coverage remains decent. Thanks!
