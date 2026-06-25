import { useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([
    {
      id: crypto.randomUUID(),
      text: "Buy milk",
      completed: false,
      updatedAt: Date.now(),
    },
    {
      id: crypto.randomUUID(),
      text: "Morning run",
      completed: true,
      updatedAt: Date.now(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const addTodo = () => {
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

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id) => {
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

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditValue(todo.text);
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
    setError("");
  };

  const saveEdit = (id) => {
    const text = editValue.trim();

    if (!text) {
      setError("Todo cannot be empty.");
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
    setEditValue("");
    setError("");
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      addTodo();
    }
  };

  const handleEditKeyDown = (event, id) => {
    if (event.key === "Enter") {
      saveEdit(id);
    }

    if (event.key === "Escape") {
      cancelEdit();
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") {
      return !todo.completed;
    }

    if (filter === "completed") {
      return todo.completed;
    }

    return true;
  });

  const remainingCount = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="app">
      <div className="todo-card">
        <div className="header">
          <h1>Todo</h1>
          <p>{remainingCount} items left</p>
        </div>

        <div className="input-row">
          <input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Add a task..."
          />
          <button onClick={addTodo}>Add</button>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="todo-list">
          {filteredTodos.map((todo) => (
            <div className="todo-item" key={todo.id}>
              {editingId === todo.id ? (
                <>
                  <input
                    className="edit-input"
                    value={editValue}
                    onChange={(event) => setEditValue(event.target.value)}
                    onKeyDown={(event) => handleEditKeyDown(event, todo.id)}
                    autoFocus
                  />
                  <button onClick={() => saveEdit(todo.id)}>Save</button>
                  <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                </>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />

                  <span className={todo.completed ? "completed" : ""}>
                    {todo.text}
                  </span>

                  <button onClick={() => startEdit(todo)}>Edit</button>
                  <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="filters">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("active")}>Active</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
          <button
            onClick={() =>
              setTodos(todos.filter((todo) => !todo.completed))
            }
          >
            Clear completed
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;