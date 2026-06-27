import { useState } from 'react';

export const TodoInput = ({ onAdd }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError('Todo cannot be empty');
      return;
    }
    onAdd(trimmed);
    setValue('');
    setError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="mb-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError('');  
          }}
          onKeyDown={handleKeyDown}
          placeholder="Add a task..."
          aria-label="New todo text"
          className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          aria-label="Add todo"
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 hover:bg-blue-600"
        >
          Add
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};
