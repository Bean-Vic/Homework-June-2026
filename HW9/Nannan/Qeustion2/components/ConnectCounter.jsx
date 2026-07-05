import { connect } from 'react-redux';
import { increment, decrement } from '../store/counterSlice';

// functional component，不直接用 Redux hooks
const ConnectCounter = ({ value, onIncrement, onDecrement }) => (
  <div className="p-4 border rounded-lg">
    <h2 className="text-lg font-semibold mb-2">Connect Version</h2>
    <p className="text-3xl font-bold mb-3">{value}</p>
    <div className="flex gap-2">
      <button
        onClick={onIncrement}
        className="px-4 py-2 bg-green-500 text-white rounded"
        aria-label="Increment via connect"
      >
        +1 (connect)
      </button>
      <button
        onClick={onDecrement}
        className="px-4 py-2 bg-red-500 text-white rounded"
        aria-label="Decrement via connect"
      >
        -1 (connect)
      </button>
    </div>
  </div>
);

const mapStateToProps = (state) => ({
  value: state.counter.value,
});

const mapDispatchToProps = {
  onIncrement: increment,
  onDecrement: decrement,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectCounter);
