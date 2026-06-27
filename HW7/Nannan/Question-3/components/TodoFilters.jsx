const FILTERS = ['All', 'Active', 'Completed'];

export const TodoFilters = ({ filter, onFilterChange, remaining, onClearCompleted }) => (
  <div className="flex items-center justify-between mt-4 text-sm">
    <span className="text-gray-500">{remaining} items left</span>
    <div className="flex gap-2">
      {FILTERS.map(f => (
        <button
          key={f}
          onClick={() => onFilterChange(f)}
          aria-pressed={filter === f}
          className={`px-2 py-1 rounded ${
            filter === f ? 'border border-gray-400' : 'text-gray-500'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
    <button
      onClick={onClearCompleted}
      className="text-gray-500 hover:text-red-500"
    >
      Clear completed
    </button>
  </div>
);
