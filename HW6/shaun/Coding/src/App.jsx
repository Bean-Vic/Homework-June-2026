import { Component } from "react";
import "./App.css";

const products = [
  { id: 1, name: "Product A", price: 15 },
  { id: 2, name: "Product B", price: 25 },
  { id: 3, name: "Product C", price: 20 },
];

class Counter extends Component {
  state = {
    value: this.props.initialValue,
  };

  updateValue = (newValue) => {
    this.setState({ value: newValue });

    if (this.props.onValueChange) {
      this.props.onValueChange(newValue);
    }
  };

  increase = () => {
    this.updateValue(this.state.value + 1);
  };

  decrease = () => {
    this.updateValue(this.state.value - 1);
  };

  render() {
    return (
      <section className="card">
        <h2>Counter</h2>
        <p className="counter-value">{this.state.value}</p>

        <div className="button-group">
          <button onClick={this.decrease}>Decrease</button>
          <button onClick={this.increase}>Increase</button>
        </div>
      </section>
    );
  }
}

function withLocalStorage(WrappedComponent, storageKey) {
  return class extends Component {
    getInitialValue() {
      const cachedValue = localStorage.getItem(storageKey);

      if (cachedValue !== null) {
        return Number(cachedValue);
      }

      return this.props.initialValue;
    }

    handleValueChange = (value) => {
      localStorage.setItem(storageKey, value);
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          initialValue={this.getInitialValue()}
          onValueChange={this.handleValueChange}
        />
      );
    }
  };
}

const CachedCounter = withLocalStorage(Counter, "counterValue");

class ShoppingCart extends Component {
  state = {
    selectedProductId: 1,
    quantity: 1,
    cart: [],
  };

  handleProductChange = (event) => {
    this.setState({
      selectedProductId: Number(event.target.value),
    });
  };

  handleQuantityChange = (event) => {
    this.setState({
      quantity: Number(event.target.value),
    });
  };

  addToCart = () => {
    const product = products.find(
      (item) => item.id === this.state.selectedProductId
    );

    const existingItem = this.state.cart.find(
      (item) => item.id === product.id
    );

    if (existingItem) {
      const updatedCart = this.state.cart.map((item) => {
        if (item.id === product.id) {
          return {
            ...item,
            quantity: item.quantity + this.state.quantity,
          };
        }

        return item;
      });

      this.setState({ cart: updatedCart });
    } else {
      this.setState({
        cart: [
          ...this.state.cart,
          {
            ...product,
            quantity: this.state.quantity,
          },
        ],
      });
    }
  };

  removeFromCart = (id) => {
    const updatedCart = this.state.cart.filter((item) => item.id !== id);

    this.setState({
      cart: updatedCart,
    });
  };

  getTotalPrice() {
    return this.state.cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  render() {
    return (
      <section className="cart-card">
        <h1>Mini Shopping Cart</h1>

        <div className="form-row">
          <select
            value={this.state.selectedProductId}
            onChange={this.handleProductChange}
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={this.state.quantity}
            onChange={this.handleQuantityChange}
          />

          <button onClick={this.addToCart}>Add</button>
        </div>

        <h2>Cart</h2>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {this.state.cart.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                  <button onClick={() => this.removeFromCart(item.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="total">
          Total: ${this.getTotalPrice().toFixed(2)}
        </h2>
      </section>
    );
  }
}

export default function App() {
  return (
    <main>
      <CachedCounter initialValue={0} />
      <ShoppingCart />
    </main>
  );
}