const products = [
  { id: 'coffee', name: 'Coffee', price: 5 },
  { id: 'sandwich', name: 'Sandwich', price: 12 },
  { id: 'salad', name: 'Salad', price: 9 },
  { id: 'tea', name: 'Tea', price: 4 },
];

const e = React.createElement;

class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.initialValue,
    };

    this.decrease = this.decrease.bind(this);
    this.increase = this.increase.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.value !== this.state.value) {
      this.props.onValueChange(this.state.value);
    }
  }

  decrease() {
    this.setState((state) => ({
      value: state.value - 1,
    }));
  }

  increase() {
    this.setState((state) => ({
      value: state.value + 1,
    }));
  }

  render() {
    return e(
      'section',
      { className: 'panel counter-panel' },
      e(
        'div',
        null,
        e('p', { className: 'label' }, 'Class Component Counter'),
        e('h2', null, this.state.value)
      ),
      e(
        'div',
        { className: 'button-row' },
        e('button', { type: 'button', onClick: this.decrease }, 'Decrease'),
        e('button', { type: 'button', onClick: this.increase }, 'Increase')
      )
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

      this.handleValueChange = this.handleValueChange.bind(this);
    }

    handleValueChange(value) {
      window.localStorage.setItem('hw6-counter-value', value);
    }

    render() {
      return e(WrappedComponent, {
        ...this.props,
        initialValue: this.state.initialValue,
        onValueChange: this.handleValueChange,
      });
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

  const rows =
    cartItems.length === 0
      ? e(
          'tr',
          null,
          e('td', { className: 'empty-cell', colSpan: 5 }, 'No items yet')
        )
      : cartItems.map((item) =>
          e(
            'tr',
            { key: item.id },
            e('td', null, item.name),
            e('td', null, `$${item.price.toFixed(2)}`),
            e('td', null, item.quantity),
            e('td', null, `$${(item.price * item.quantity).toFixed(2)}`),
            e(
              'td',
              null,
              e(
                'button',
                {
                  className: 'delete-button',
                  type: 'button',
                  onClick: () => deleteItem(item.id),
                },
                'Delete'
              )
            )
          )
        );

  return e(
    'section',
    { className: 'panel cart-panel' },
    e(
      'div',
      { className: 'section-heading' },
      e('p', { className: 'label' }, 'Mini Shopping Cart'),
      e('h2', null, `$${subtotal.toFixed(2)}`)
    ),
    e(
      'div',
      { className: 'cart-form' },
      e(
        'label',
        null,
        'Item',
        e(
          'select',
          {
            value: selectedId,
            onChange: (event) => setSelectedId(event.target.value),
          },
          products.map((product) =>
            e(
              'option',
              { key: product.id, value: product.id },
              `${product.name} - $${product.price}`
            )
          )
        )
      ),
      e(
        'label',
        null,
        'Quantity',
        e('input', {
          min: '1',
          type: 'number',
          value: quantity,
          onChange: (event) => setQuantity(event.target.value),
        })
      ),
      e('button', { type: 'button', onClick: addToCart }, 'Add to Cart')
    ),
    e(
      'table',
      null,
      e(
        'thead',
        null,
        e(
          'tr',
          null,
          e('th', null, 'Item'),
          e('th', null, 'Price'),
          e('th', null, 'Quantity'),
          e('th', null, 'Total'),
          e('th', null, 'Action')
        )
      ),
      e('tbody', null, rows)
    )
  );
}

function App() {
  return e(
    'main',
    { className: 'app-shell' },
    e(
      'header',
      null,
      e('p', { className: 'label' }, 'HW6 React Fundamentals'),
      e('h1', null, 'Counter and Shopping Cart')
    ),
    e(
      'div',
      { className: 'layout' },
      e(CachedCounter, { initialValue: 0 }),
      e(ShoppingCart)
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(e(App));
