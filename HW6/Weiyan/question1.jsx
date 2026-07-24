import React, { Component } from 'react';

class Counter extends Component{
  state = { count: this.props.initialCount || 0 };

  increment = () => {
    this.setState((prevState) => ({ count: prevState.count + 1 }));
  };

  decrement = () => {
    this.setState((prevState) => ({ count: prevState.count - 1 }));
  }

  render() {
    return (
      <div className="p-4 text-center">
        <p className="mb-2 text-lg">Count: {this.state.count}</p>
        <button onClick={this.increment} className="mr-2 px-3 py-1 bg-blue-500 text-white rounded">
          +1
        </button>
        <button onClick={this.decrement} className="px-3 py-1 bg-gray-500 text-white rounded">
          -1
        </button>
      </div>
    );
  }
}

export default Counter;