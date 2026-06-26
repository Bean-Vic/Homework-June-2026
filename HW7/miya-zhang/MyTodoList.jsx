import { useEffect, useState } from "react";
import "./MiyaTodoList.css";

const STORAGE_KEY = "todo-list";

function MiyaTodoList() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const createId = () => {
    if (crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Date.now().toString();
  };

  const addTodo = () => {
    const text = inputValue.trim();

    if (!text) {
      setError("Please enter a todo first.");
      return;
    }

    const newTodo = {
      id: createId(),
      text,
      completed: false,
      updatedAt: Date.now(),
    };

    setTodos([newTodo, ...todos]);
    setInputValue("");
    setError("");
  };

  const handleAddKeyDown = (event) => {
    if (event.key === "Enter") {
      addTodo();
    }
  };

  const deleteTodo = (id) => {
    const confirmed = window.confirm("Delete this todo?");
    if (!confirmed) return;

    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: Date.now() }
          : todo,
      ),
    );
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
    setError("");
  };

  const saveEdit = (id) => {
    const text = editingText.trim();

    if (!text) {
      setError("Todo text cannot be empty.");
      return;
    }

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text, updatedAt: Date.now() } : todo,
      ),
    );

    setEditingId(null);
    setEditingText("");
    setError("");
  };

  const handleEditKeyDown = (event, id) => {
    if (event.key === "Enter") {
      saveEdit(id);
    }

    if (event.key === "Escape") {
      cancelEdit();
    }
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const remainingCount = todos.filter((todo) => !todo.completed).length;

  return (
    <main className="todo-page">
      <section className="todo-card">
        <div className="todo-header">
          <h1>Todo</h1>
          <p>{remainingCount} items left</p>
        </div>

        <div className="todo-input-row">
          <input
            type="text"
            placeholder="Add a task..."
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value);
              setError("");
            }}
            onKeyDown={handleAddKeyDown}
            aria-label="Add a new todo"
          />

          <button onClick={addTodo} disabled={!inputValue.trim()}>
            Add
          </button>
        </div>

        {error && <p className="todo-error">{error}</p>}

        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className={todo.completed ? "todo-item completed" : "todo-item"}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                aria-label="Toggle completed"
              />

              {editingId === todo.id ? (
                <input
                  className="edit-input"
                  value={editingText}
                  onChange={(event) => setEditingText(event.target.value)}
                  onKeyDown={(event) => handleEditKeyDown(event, todo.id)}
                  autoFocus
                  aria-label="Edit todo"
                />
              ) : (
                <span className="todo-text">{todo.text}</span>
              )}

              <div className="todo-actions">
                {editingId === todo.id ? (
                  <>
                    <button onClick={() => saveEdit(todo.id)}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(todo)}>Edit</button>
                    <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <p className="empty-message">No todos yet. Add one above.</p>
        )}

        <div className="todo-footer">
          <button
            className={filter === "all" ? "active-filter" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>

          <button
            className={filter === "active" ? "active-filter" : ""}
            onClick={() => setFilter("active")}
          >
            Active
          </button>

          <button
            className={filter === "completed" ? "active-filter" : ""}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>

          <button onClick={clearCompleted}>Clear completed</button>
        </div>
      </section>
    </main>
  );
}

export default MiyaTodoList;
