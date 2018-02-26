import React, { Component } from 'react'
import classNames from 'classnames'
import { view } from 'react-easy-state'
import { params } from 'react-easy-params'
import TodoItem from './TodoItem'
import todosStore from './todosStore'

// render is triggered whenever the relevant parts of the global todos store change
class App extends Component {
  changeFilter = ev => {
    params.filter = ev.target.value
  };

  // create a todo on Enter key press
  createTodo = ev => {
    if (ev.keyCode === 13 && ev.target.value) {
      todosStore.create(ev.target.value)
      ev.target.value = ''
    }
  };

  render () {
    const {
      todos,
      isEmpty,
      hasCompleted,
      allCompleted,
      activeCount,
      toggleAll,
      clearCompleted
    } = todosStore

    const todosClass = classNames({ selected: params.filter === 'all' })
    const completedClass = classNames({ selected: params.filter === 'completed' })
    const activeClass = classNames({ selected: params.filter === 'active' })

    return (
      <div className='todoapp'>
        <header className='header'>
          <h1>todos</h1>
          <input
            onKeyUp={this.createTodo}
            className='new-todo'
            placeholder='What needs to be done?'
            autoFocus
          />
        </header>

        {!isEmpty && (
          <section className='main'>
            <input
              className='toggle-all'
              type='checkbox'
              checked={allCompleted}
              onChange={toggleAll}
            />
            <label htmlFor='toggle-all'>Mark all as complete</label>
            <ul className='todo-list'>
              {todos.map((todo, idx) => (
                <TodoItem {...todo} id={idx} key={idx} />
              ))}
            </ul>
          </section>
        )}

        {!isEmpty && (
          <footer className='footer'>
            <span className='todo-count'>{activeCount} items left</span>
            <div className='filters'>
              <button
                className={todosClass}
                value='all'
                onClick={this.changeFilter}
              >
                All
              </button>
              <button
                className={activeClass}
                value='active'
                onClick={this.changeFilter}
              >
                Active
              </button>
              <button
                className={completedClass}
                value='completed'
                onClick={this.changeFilter}
              >
                Completed
              </button>
            </div>
            {hasCompleted && (
              <button className='clear-completed' onClick={clearCompleted}>
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>
    )
  }
}

// wrap the component with view() before exporting it
export default view(App)
