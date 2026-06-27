import { useReducer, useEffect } from 'react';
import { todosReducer, ACTIONS } from '../reducers/todosReducer';

const STORAGE_KEY = 'todo-list';

const init = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const useTodos = () => {
  const [todos, dispatch] = useReducer(todosReducer, null, init);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  return {
    todos,
    addTodo: (text) => dispatch({ type: ACTIONS.ADD, payload: { text } }),
    deleteTodo: (id) => dispatch({ type: ACTIONS.DELETE, payload: { id } }),
    toggleTodo: (id) => dispatch({ type: ACTIONS.TOGGLE, payload: { id } }),
    editTodo: (id, text) => dispatch({ type: ACTIONS.EDIT, payload: { id, text } }),
    clearCompleted: () => dispatch({ type: ACTIONS.CLEAR_COMPLETED }),
  };
};
