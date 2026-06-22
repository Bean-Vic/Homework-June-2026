const products = [
  { id: 'coffee', name: 'Coffee', price: 5 },
  { id: 'sandwich', name: 'Sandwich', price: 12 },
  { id: 'salad', name: 'Salad', price: 9 },
  { id: 'tea', name: 'Tea', price: 4 },
];

class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.initialValue,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.value !== this.state.value) {
      this.props.onValueChange(this.state.value);
    }
  }

  decrease = () => {
    this.setState((state) => ({
      value: state.value - 1,
    }));
  };

  increase = () => {
    this.setState((state) => ({
      value: state.value + 1,
    }));
  };

  render() {
    return (
      <section className="panel counter-panel">
        <div>
          <p className="label">Class Component Counter</p>
          <h2>{this.state.value}</h2>
        </div>

        <div className="button-row">
          <button type="button" onClick={this.decrease}>
            Decrease
          </button>
          <button type="button" onClick={this.increase}>
            Increase
          </button>
        </div>
      </section>
    );
  }
}

function withCachedInitialValue(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);

      const cachedValue = window.localStorage.getItem('hw6-counter-value');
      const parsedValue = Number(cachedValue);

      this.state = {
        initialValue: Number.isFinite(parsedValue) ? parsedValue : props.initialValue,
      };
    }

    handleValueChange = (value) => {
      window.localStorage.setItem('hw6-counter-value', value);
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          initialValue={this.state.initialValue}
          onValueChange={this.handleValueChange}
        />
      );
    }
  };
}

const CachedCounter = withCachedInitialValue(Counter);

function ShoppingCart() {
  const [selectedId, setSelectedId] = React.useState(products[0].id);
  const [quantity, setQuantity] = React.useState(1);
  const [cartItems, setCartItems] = React.useState([]);

  const selectedProduct = products.find((product) => product.id === selectedId);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = () => {
    const safeQuantity = Math.max(1, Number(quantity) || 1);

    setCartItems((items) => {
      const existingItem = items.find((item) => item.id === selectedProduct.id);

      if (existingItem) {
        return items.map((item) =>
          item.id === selectedProduct.id
            ? { ...item, quantity: item.quantity + safeQuantity }
            : item
        );
      }

      return [...items, { ...selectedProduct, quantity: safeQuantity }];
    });

    setQuantity(1);
  };

  const deleteItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <section className="panel cart-panel">
      <div className="section-heading">
        <p className="label">Mini Shopping Cart</p>
        <h2>${subtotal.toFixed(2)}</h2>
      </div>

      <div className="cart-form">
        <label>
          Item
          <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - ${product.price}
              </option>
            ))}
          </select>
        </label>

        <label>
          Quantity
          <input
            min="1"
            type="number"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </label>

        <button type="button" onClick={addToCart}>
          Add to Cart
        </button>
      </div>

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
          {cartItems.length === 0 ? (
            <tr>
              <td className="empty-cell" colSpan="5">
                No items yet
              </td>
            </tr>
          ) : (
            cartItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                  <button className="delete-button" type="button" onClick={() => deleteItem(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}

function App() {
  return (
    <main className="app-shell">
      <header>
        <p className="label">HW6 React Fundamentals</p>
        <h1>Counter and Shopping Cart</h1>
      </header>

      <div className="layout">
        <CachedCounter initialValue={0} />
        <ShoppingCart />
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
