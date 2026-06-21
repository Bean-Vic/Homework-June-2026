import { useEffect, useRef, useState } from 'react'

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TodoItem({
  todo,
  isEditing,
  onToggle,
  onDelete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
}) {
  const [draft, setDraft] = useState(todo.text)
  const [editError, setEditError] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing) {
      setDraft(todo.text)
      setEditError('')
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing, todo.text])

  const attemptSave = () => {
    const trimmed = draft.trim()
    if (!trimmed) {
      setEditError('Todo cannot be empty.')
      return
    }
    onSaveEdit(todo.id, trimmed)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      attemptSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onCancelEdit()
    }
  }

  if (isEditing) {
    return (
      <li className="px-4 py-3">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value)
              if (editError) setEditError('')
            }}
            onKeyDown={handleKeyDown}
            aria-label="Edit todo"
            className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-slate-800 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
          <button
            type="button"
            onClick={attemptSave}
            className="font-medium text-slate-500 hover:text-slate-900"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancelEdit}
            className="font-medium text-slate-500 hover:text-slate-900"
          >
            Cancel
          </button>
        </div>
        {editError ? (
          <p className="mt-2 pl-1 text-sm text-red-600">{editError}</p>
        ) : (
          <p className="mt-2 pl-1 text-xs text-slate-400">Enter to save, Esc to cancel.</p>
        )}
      </li>
    )
  }

  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <button
        type="button"
        role="checkbox"
        aria-checked={todo.completed}
        aria-label={todo.completed ? 'Mark as active' : 'Mark as completed'}
        onClick={() => onToggle(todo.id)}
        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-slate-300 text-slate-500 hover:border-slate-400"
      >
        {todo.completed && <CheckIcon />}
      </button>
      <span
        className={
          'flex-1 break-words ' +
          (todo.completed ? 'text-slate-400 line-through' : 'text-slate-800')
        }
      >
        {todo.text}
      </span>
      <button
        type="button"
        onClick={() => onStartEdit(todo.id)}
        className="font-medium text-slate-500 hover:text-slate-900"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        className="font-medium text-slate-500 hover:text-red-600"
      >
        Delete
      </button>
    </li>
  )
}

export default TodoItem
