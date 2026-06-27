import { useState, useMemo } from 'react';
import { useTodos } from '../hooks/useTodos';
import { TodoInput } from './TodoInput';
import { TodoItem } from './TodoItem';
import { TodoFilters } from './TodoFilters';

export const TodoApp = () => {
  const { todos, addTodo, deleteTodo, toggleTodo, editTodo, clearCompleted } = useTodos();
  const [filter, setFilter] = useState('All');

  const filteredTodos = useMemo(() => {
    if (filter === 'Active') return todos.filter(t => !t.completed);
    if (filter === 'Completed') return todos.filter(t => t.completed);
    return todos;
  }, [todos, filter]);

  const remaining = useMemo(
    () => todos.filter(t => !t.completed).length,
    [todos]
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex items-baseline justify-between mb-4">
        <h1 className="text-2xl font-bold">Todo</h1>
        <span className="text-sm text-gray-500">{remaining} items left</span>
      </div>

      <TodoInput onAdd={addTodo} />

      <ul aria-label="Todo list">
        {filteredTodos.length === 0 ? (
          <li className="text-center text-gray-400 py-4">No todos yet</li>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          ))
        )}
      </ul>

      <TodoFilters
        filter={filter}
        onFilterChange={setFilter}
        remaining={remaining}
        onClearCompleted={clearCompleted}
      />
    </div>
  );
};
