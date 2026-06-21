import { useState } from 'react'
import TodoItem from './TodoItem.jsx'

const FILTERS = ['all', 'active', 'completed']

function TodoList() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [filter, setFilter] = useState('all')

  const handleAdd = (e) => {
    e.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed) {
      setError('Please enter a task before adding.')
      return
    }
    const newTodo = {
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
    }
    setTodos((prev) => [newTodo, ...prev])
    setInputValue('')
    setError('')
  }

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
    if (editingId === id) setEditingId(null)
  }

  const startEdit = (id) => setEditingId(id)

  const cancelEdit = () => setEditingId(null)

  const saveEdit = (id, text) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text } : todo)),
    )
    setEditingId(null)
  }

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed))
  }

  const remaining = todos.filter((todo) => !todo.completed).length

  const visibleTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  return (
    <div className="min-h-screen bg-slate-100 py-12">
      <main className="mx-auto w-full max-w-lg px-4">
        <header className="mb-5 flex items-baseline justify-between">
          <h1 className="text-4xl font-bold text-slate-900">Todo</h1>
          <span className="text-lg text-slate-500">
            {remaining} {remaining === 1 ? 'item' : 'items'} left
          </span>
        </header>

        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              if (error) setError('')
            }}
            placeholder="Add a task..."
            aria-label="Add a task"
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
          <button
            type="submit"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
          >
            Add
          </button>
        </form>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <ul className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {visibleTodos.length === 0 ? (
            <li className="px-4 py-8 text-center text-slate-400">
              {todos.length === 0 ? 'No tasks yet. Add one above.' : 'Nothing here.'}
            </li>
          ) : (
            visibleTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isEditing={editingId === todo.id}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onStartEdit={startEdit}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
              />
            ))
          )}
        </ul>

        <footer className="mt-6 flex items-center gap-2">
          {FILTERS.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setFilter(name)}
              className={
                'rounded-lg px-3 py-1 font-medium capitalize ' +
                (filter === name
                  ? 'border border-slate-300 bg-white text-slate-900'
                  : 'text-slate-500 hover:text-slate-900')
              }
            >
              {name}
            </button>
          ))}
          <button
            type="button"
            onClick={clearCompleted}
            className="ml-auto font-medium text-slate-500 hover:text-slate-900"
          >
            Clear completed
          </button>
        </footer>
      </main>
    </div>
  )
}

export default TodoList
