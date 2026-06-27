export const ACTIONS = {
  ADD: 'ADD',
  DELETE: 'DELETE',
  TOGGLE: 'TOGGLE',
  EDIT: 'EDIT',
  CLEAR_COMPLETED: 'CLEAR_COMPLETED',
};

export const todosReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD: {
      const newTodo = {
        id: crypto.randomUUID(),
        text: action.payload.text.trim(),
        completed: false,
        updatedAt: Date.now(),
      };
      return [newTodo, ...state];
    }

    case ACTIONS.DELETE:
      return state.filter(todo => todo.id !== action.payload.id);

    case ACTIONS.TOGGLE:
      return state.map(todo =>
        todo.id === action.payload.id
          ? { ...todo, completed: !todo.completed, updatedAt: Date.now() }
          : todo
      );

    case ACTIONS.EDIT:
      return state.map(todo =>
        todo.id === action.payload.id
          ? { ...todo, text: action.payload.text.trim(), updatedAt: Date.now() }
          : todo
      );

    case ACTIONS.CLEAR_COMPLETED:
      return state.filter(todo => !todo.completed);

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};
