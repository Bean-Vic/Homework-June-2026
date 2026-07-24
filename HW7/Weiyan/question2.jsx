import React, { useState } from 'react';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const activeCount = todos.filter((todo) => !todo.completed).length;

  // Handlers
  const handleAddTodo = () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return; // Fail silently for a cleaner UI

    const newTodo = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      text: trimmedInput,
      completed: false,
      updatedAt: Date.now(),
    };

    setTodos((prevTodos) => [newTodo, ...prevTodos]);
    setInputValue('');
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') handleAddTodo();
  };

  const handleToggleComplete = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: Date.now() }
          : todo
      )
    );
  };

  const handleDelete = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = (id) => {
    const trimmedEdit = editText.trim();
    if (!trimmedEdit) return;

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? { ...todo, text: trimmedEdit, updatedAt: Date.now() }
          : todo
      )
    );
    setEditingId(null);
    setEditText('');
  };

  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter') saveEdit(id);
    else if (e.key === 'Escape') cancelEditing();
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 font-sans text-gray-800">

      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Todo</h1>
        <span className="text-lg text-gray-500">{activeCount} left</span>
      </div>

      {/* Input Group */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          className="flex-1 px-4 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 placeholder-gray-400"
          placeholder="Add a task..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        <button
          onClick={handleAddTodo}
          className="px-6 py-2 text-lg border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Add
        </button>
      </div>

      {/* Container */}
      <div className="bg-white border border-gray-200 rounded-md shadow-sm">
        {todos.length === 0 && (
          <div className="p-4 text-center text-gray-400">No tasks yet.</div>
        )}

        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex justify-between items-center p-4 border-b border-gray-200 last:border-b-0"
          >
            {/* Left Side: Checkbox & Text */}
            <div className="flex items-center gap-4 flex-1">
              <input
                type="checkbox"
                className="w-5 h-5 border-gray-300 rounded cursor-pointer accent-gray-700"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id)}
              />

              {editingId === todo.id ? (
                <input
                  type="text"
                  autoFocus
                  className="flex-1 px-2 py-1 text-lg border-b border-gray-400 focus:outline-none bg-gray-50"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => handleEditKeyDown(e, todo.id)}
                  onBlur={cancelEditing} // Optional: cancels edit if they click away
                />
              ) : (
                <span
                  onDoubleClick={() => startEditing(todo)}
                  className={`text-lg transition-colors ${
                    todo.completed ? 'line-through text-gray-400' : 'text-gray-900'
                  }`}
                >
                  {todo.text}
                </span>
              )}
            </div>

            {/* Right Side: Actions */}
            <div className="flex gap-4 ml-4 text-gray-500">
              {editingId === todo.id ? (
                <span className="text-sm italic text-gray-400">Press Enter to save</span>
              ) : (
                <>
                  <button
                    onClick={() => startEditing(todo)}
                    className="hover:text-gray-900 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="hover:text-gray-900 transition-colors"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}