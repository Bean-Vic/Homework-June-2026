import React, { useEffect, useState } from "react";
// Build a functional component with React hooks:
// 1. Render a Todo List page.
// HW7: React Hooks 2
// 2. The page should contain a text input and an Add button:
// When the input is not empty, clicking Add should create a new todo at the
// top of the list.
// Pressing Enter should also submit.
// After submission, clear the input.


//
export const TodoList = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    const savedTodos = localStorage.getItem("todo-list");

    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todo-list", JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    const text = inputValue.trim();

    if (!text) {
      setError("Todo cannot be empty.");
      return;
    }

    const newTodo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      updatedAt: Date.now(),
    };

    setTodos([newTodo, ...todos]);
    setInputValue("");
    setError("");
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleToggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              updatedAt: Date.now(),
            }
          : todo
      )
    );
  };

  const handleStartEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
    setError("");
  };

  const handleSaveEdit = (id) => {
    const text = editingText.trim();

    if (!text) {
      setError("Todo text cannot be empty.");
      return;
    }

    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              text,
              updatedAt: Date.now(),
            }
          : todo
      )
    );

    setEditingId(null);
    setEditingText("");
    setError("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
    setError("");
  };

  const handleAddKeyDown = (event) => {
    if (event.key === "Enter") {
      handleAddTodo();
    }
  };

  const handleEditKeyDown = (event, id) => {
    if (event.key === "Enter") {
      handleSaveEdit(id);
    }

    if (event.key === "Escape") {
      handleCancelEdit();
    }
  };

  // 3. Each todo item should display:
// The text content
// An Edit button (switch to editable state, save with Enter, cancel with Esc)
// A Delete button (remove the todo; optional: confirm before delete)
// 4. Support toggle completed state (checkbox or button). Completed items
// should have different styling (e.g., strikethrough or opacity).

///// 5. Use a stable key when rendering list items (e.g., id instead of array index).
// 6. Implement input validation and error handling:
// Prevent adding empty/whitespace-only todos.
// Apply the same validation when editing.
// Show user-friendly feedback for errors (e.g., toast, text message).
// 7. Use clear state management (e.g., todos , inputValue , editingId ).
// 8. Optional: Add filters and counts
// Filters: All / Active / Completed
// Show remaining count (e.g., “2 items left”). 

  return (
    <div>
      <h1>Todo List</h1>

      <input
        type="text"
        value={inputValue}
        placeholder="Enter a todo"
        aria-label="Todo input"
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={handleAddKeyDown}
      />

      <button onClick={handleAddTodo}>Add</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {editingId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  aria-label="Edit todo"
                  onChange={(event) => setEditingText(event.target.value)}
                  onKeyDown={(event) => handleEditKeyDown(event, todo.id)}
                />

                <button onClick={() => handleSaveEdit(todo.id)}>Save</button>

                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                  aria-label="Toggle completed"
                />
            <button onClick={() => handleStartEdit(todo)}>Edit</button>

            <button onClick={() => handleDeleteTodo(todo.id)}>
                Delete
            </button>
            </>
        )}
          </li>
        ))}
      </ul>

    <p>
    {todos.filter((todo) => !todo.completed).length} items left
    </p>
    </div>
  );
};