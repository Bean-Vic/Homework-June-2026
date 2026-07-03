import { useState } from "react";
import {
  PRODUCTS,
  addProduct,
  calculateTotal,
  removeProduct,
} from "./cart.js";
import "./MiniShoppingCart.css";

function formatPrice(amount) {
  return `$${amount.toFixed(2)}`;
}

function MiniShoppingCart() {
  const [selectedId, setSelectedId] = useState(PRODUCTS[0].id);
  const [quantity, setQuantity] = useState("1");
  const [cart, setCart] = useState([]);

  const handleAdd = () => {
    const product = PRODUCTS.find((item) => item.id === selectedId);
    const parsedQuantity = Number(quantity);

    if (!product || !Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      return;
    }

    setCart((currentCart) => addProduct(currentCart, product, parsedQuantity));
    setQuantity("1");
  };

  const total = calculateTotal(cart);

  return (
    <div className="shopping-cart">
      <h2>Mini Shopping Cart</h2>

      <div className="cart-controls">
        <label>
          <span>Product</span>
          <select
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
          >
            {PRODUCTS.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ({formatPrice(product.price)})
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Quantity</span>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </label>

        <button type="button" onClick={handleAdd}>
          Add to Cart
        </button>
      </div>

      <div className="cart-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-cart">
                  Your cart is empty.
                </td>
              </tr>
            ) : (
              cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{formatPrice(item.price)}</td>
                  <td>{item.quantity}</td>
                  <td>{formatPrice(item.price * item.quantity)}</td>
                  <td>
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() =>
                        setCart((currentCart) =>
                          removeProduct(currentCart, item.id),
                        )
                      }
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {cart.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan="3">Grand Total</td>
                <td>{formatPrice(total)}</td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

export default MiniShoppingCart;
