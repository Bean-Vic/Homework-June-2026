import { useState, useRef, useEffect } from 'react';

export const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const startEdit = () => {
    setDraft(todo.text);
    setIsEditing(true);
    setError('');
  };

  const saveEdit = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setError('Todo cannot be empty');
      return;
    }
    if (trimmed !== todo.text) {
      onEdit(todo.id, trimmed);
    }
    setIsEditing(false);
    setError('');
  };

  const cancelEdit = () => {
    setDraft(todo.text);  // 恢复原值
    setIsEditing(false);
    setError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${todo.text}"?`)) {
      onDelete(todo.id);
    }
  };

  return (
    <li className="flex items-center gap-2 py-2 border-b">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        disabled={isEditing}
      />

      {isEditing ? (
        <>
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Edit todo"
            className="flex-1 px-2 py-1 border rounded"
          />
          <button onClick={saveEdit} aria-label="Save">Save</button>
          <button onClick={cancelEdit} aria-label="Cancel">Cancel</button>
        </>
      ) : (
        <>
          <span
            className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : ''}`}
          >
            {todo.text}
          </span>
          <button onClick={startEdit} aria-label={`Edit ${todo.text}`}>Edit</button>
          <button onClick={handleDelete} aria-label={`Delete ${todo.text}`}>Delete</button>
        </>
      )}
      {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
    </li>
  );
};
