import { todosReducer, ACTIONS } from './todosReducer';

describe('todosReducer', () => {
  it('ADD: adds a new todo to the top', () => {
    const initial = [{ id: '1', text: 'old', completed: false, updatedAt: 0 }];
    const result = todosReducer(initial, {
      type: ACTIONS.ADD,
      payload: { text: 'new' },
    });
    expect(result).toHaveLength(2);
    expect(result[0].text).toBe('new');
    expect(result[0].completed).toBe(false);
    expect(result[1]).toBe(initial[0]);  
  });

  it('ADD: trims whitespace', () => {
    const result = todosReducer([], {
      type: ACTIONS.ADD,
      payload: { text: '  hello  ' },
    });
    expect(result[0].text).toBe('hello');
  });

  it('DELETE: removes the matching todo', () => {
    const initial = [
      { id: '1', text: 'a', completed: false },
      { id: '2', text: 'b', completed: false },
    ];
    const result = todosReducer(initial, {
      type: ACTIONS.DELETE,
      payload: { id: '1' },
    });
    expect(result).toEqual([initial[1]]);
  });

  it('TOGGLE: flips completed', () => {
    const initial = [{ id: '1', text: 'a', completed: false, updatedAt: 0 }];
    const result = todosReducer(initial, {
      type: ACTIONS.TOGGLE,
      payload: { id: '1' },
    });
    expect(result[0].completed).toBe(true);
  });

  it('EDIT: updates text and timestamp', () => {
    const initial = [{ id: '1', text: 'old', completed: false, updatedAt: 0 }];
    const result = todosReducer(initial, {
      type: ACTIONS.EDIT,
      payload: { id: '1', text: 'new' },
    });
    expect(result[0].text).toBe('new');
    expect(result[0].updatedAt).toBeGreaterThan(0);
  });

  it('CLEAR_COMPLETED: removes completed todos', () => {
    const initial = [
      { id: '1', text: 'a', completed: true },
      { id: '2', text: 'b', completed: false },
    ];
    const result = todosReducer(initial, { type: ACTIONS.CLEAR_COMPLETED });
    expect(result).toEqual([initial[1]]);
  });
});
