import { Component } from "react";

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: props.initialValue ?? 0,
    };
  }

  increment = () => {
    this.setState(
      (prev) => ({ count: prev.count + 1 }),
      () => this.props.onUpdate?.(this.state.count)
    );
  };

  decrement = () => {
    this.setState(
      (prev) => ({ count: prev.count - 1 }),
      () => this.props.onUpdate?.(this.state.count)
    );
  };

  render() {
    const { count } = this.state;
    return (
      <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center gap-6 w-80">
        <h1 className="text-2xl font-bold text-gray-700">Counter</h1>

        <span className="text-6xl font-mono font-semibold text-indigo-600">
          {count}
        </span>

        <div className="flex gap-4">
          <button
            onClick={this.decrement}
            className="w-14 h-14 rounded-full bg-red-100 text-red-600 text-2xl font-bold hover:bg-red-200 transition"
          >
            −
          </button>
          <button
            onClick={this.increment}
            className="w-14 h-14 rounded-full bg-green-100 text-green-600 text-2xl font-bold hover:bg-green-200 transition"
          >
            +
          </button>
        </div>

        <p className="text-xs text-gray-400">Value is saved to localStorage</p>
      </div>
    );
  }
}

export default Counter;
