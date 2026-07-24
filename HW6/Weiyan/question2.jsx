import React, { useState, useMemo } from 'react';

const PRODUCTS = [
  { id: 'p_01', name: 'Product A', price: 15.00 },
  { id: 'p_02', name: 'Product B', price: 18.00 },
  { id: 'p_03', name: 'Product C', price: 20.00 },
];

export default function MiniShoppingCart() {
  const [cart, setCart] = useState([]);
  const [selectedId, setSelectedId] = useState(PRODUCTS[0].id);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const addToCart = () => {
    const quantity = parseInt(selectedQuantity);

    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.product.id === selectedId);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.product.id === selectedId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const productToAdd = PRODUCTS.find(p => p.id === selectedId);
        return [...prevCart, { product: productToAdd, quantity: quantity }];
      }
    });

    setSelectedQuantity(1);
  };

  const removeFromCart = (Id) => {
    setCart((prevCart) => prevCart.filter(item => item.product.id !== Id));
  };


  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }, [cart]);

  return (
    <div style={styles.container}>
      <h1>Mini Shopping Cart</h1>

      <div style={styles.card}>
        <div style={styles.controls}>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {PRODUCTS.map(product => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>

          <input type="number" min="1" value={selectedQuantity}
            onChange={(e) => setSelectedQuantity(e.target.value)}
          />

          <button onClick={addToCart}>Add</button>
        </div>

        <h3>Cart</h3>

        {cart.length === 0 ? (
          <p>Add products to cart.</p>
        ) : (
          <ul>
            {cart.map(item => (
              <li key={item.product.id} style={styles.listItem}>
                <span>{item.product.name} x {item.quantity}</span>
                <span>${item.product.price * item.quantity}</span>
                <button onClick={() => removeFromCart(item.product.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}

        <div style={styles.footer}>
          <strong>Total:</strong>
          <strong>${cartTotal.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '40px auto',
    fontFamily: 'sans-serif',
  },
  card: {
    border: '1px solid #333',
    padding: '16px',
  },
  controls: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    marginBottom: '8px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '16px',
  },
};
