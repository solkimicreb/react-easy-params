import { easyStore } from 'react-easy-state'
import { easyParams } from 'react-easy-params'

// a complex global store with a lot of derived data (getters and setters)
const store = easyStore({
  all: [],
  filter: 'all',
  get isEmpty () {
    return this.all.length === 0
  },
  get completed () {
    return this.all.filter(todo => todo.completed)
  },
  get hasCompleted () {
    return this.completed.length !== 0
  },
  get allCompleted () {
    return this.all.every(todo => todo.completed)
  },
  set allCompleted (completed) {
    this.all.forEach(todo => {
      todo.completed = completed
    })
  },
  get active () {
    return this.all.filter(todo => !todo.completed)
  },
  create (title) {
    this.all.push({ title })
  },
  changeFilter (filter) {
    this.filter = filter
  },
  remove (id) {
    this.all.splice(id, 1)
  },
  toggle (id) {
    const todo = this.all[id]
    todo.completed = !todo.completed
  },
  toggleAll () {
    this.allCompleted = !this.allCompleted
  },
  clearCompleted () {
    this.all = this.active
  }
})

// store.filter is two-way synchronized with the URL query string
// and adds a new history item whenever it changes
// store.all is synchronized with the LocalStorage,
// so the todos are kept between page reloads
easyParams(store, {
  filter: ['url', 'history'],
  all: ['storage']
})

export default store
