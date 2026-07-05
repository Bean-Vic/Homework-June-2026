import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from '../store/counterSlice';

const HooksCounter = () => {
    
  const value = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Hooks Version</h2>
      <p className="text-3xl font-bold mb-3">{value}</p>
      <div className="flex gap-2">
        <button
          onClick={() => dispatch(increment())}
          className="px-4 py-2 bg-green-500 text-white rounded"
          aria-label="Increment via hooks"
        >
          +1 (hooks)
        </button>
        <button
          onClick={() => dispatch(decrement())}
          className="px-4 py-2 bg-red-500 text-white rounded"
          aria-label="Decrement via hooks"
        >
          -1 (hooks)
        </button>
      </div>
    </div>
  );
};

export default HooksCounter;
