// ShoppingCart.jsx
import { Component } from "react";

const PRODUCTS = [
  { id: 1, name: "Product A", price: 15 },
  { id: 2, name: "Product B", price: 25 },
  { id: 3, name: "Product C", price: 20 },
  { id: 4, name: "Product D", price: 10 },
];

class ShoppingCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: PRODUCTS[0].id,
      quantity: 1,
      cart: [], // [{ product, quantity }]
    };
  }

  handleAdd = () => {
    const { selectedId, quantity, cart } = this.state;
    const product = PRODUCTS.find((p) => p.id === selectedId);
    const qty = parseInt(quantity, 10);

    if (!qty || qty <= 0) return;

    // 如果已在购物车，累加数量
    const existing = cart.find((item) => item.product.id === selectedId);
    if (existing) {
      this.setState({
        cart: cart.map((item) =>
          item.product.id === selectedId
            ? { ...item, quantity: item.quantity + qty }
            : item
        ),
      });
    } else {
      this.setState({ cart: [...cart, { product, quantity: qty }] });
    }
  };

  handleRemove = (productId) => {
    this.setState({
      cart: this.state.cart.filter((item) => item.product.id !== productId),
    });
  };

  getTotal = () =>
    this.state.cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

  render() {
    const { selectedId, quantity, cart } = this.state;

    const styles = {
      page: {
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        justifyContent: "center",
        padding: "40px 16px",
        fontFamily: "Arial, sans-serif",
      },
      wrapper: { width: "100%", maxWidth: "600px" },
      title: { fontSize: "2rem", fontWeight: "bold", textAlign: "center", marginBottom: "24px" },
      card: {
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "16px",
      },
      row: { display: "flex", gap: "12px", alignItems: "center" },
      select: {
        flex: 2,
        padding: "10px 14px",
        fontSize: "1rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
      },
      input: {
        flex: 1,
        padding: "10px 14px",
        fontSize: "1rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        textAlign: "center",
      },
      addBtn: {
        flex: 1,
        padding: "10px 0",
        fontSize: "1rem",
        fontWeight: "bold",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "8px",
        cursor: "pointer",
      },
      sectionTitle: { fontSize: "1.3rem", fontWeight: "bold", marginBottom: "16px" },
      cartRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid #eee",
      },
      cartLabel: { fontSize: "1rem" },
      cartRight: { display: "flex", alignItems: "center", gap: "12px" },
      cartPrice: { fontSize: "1rem", minWidth: "60px", textAlign: "right" },
      removeBtn: {
        padding: "6px 14px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        background: "#fff",
        cursor: "pointer",
        fontSize: "0.9rem",
      },
      emptyMsg: { color: "#aaa", fontSize: "0.9rem", padding: "8px 0" },
      totalCard: {
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      },
      totalLabel: { fontSize: "1.3rem", fontWeight: "bold" },
      totalAmount: { fontSize: "1.3rem", fontWeight: "bold" },
    };

    return (
      <div style={styles.page}>
        <div style={styles.wrapper}>
          <h1 style={styles.title}>Mini Shopping Cart</h1>

          {/* 选择商品 + 数量 + 添加 */}
          <div style={styles.card}>
            <div style={styles.row}>
              <select
                style={styles.select}
                value={selectedId}
                onChange={(e) => this.setState({ selectedId: Number(e.target.value) })}
              >
                {PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ${p.price}
                  </option>
                ))}
              </select>

              <input
                style={styles.input}
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => this.setState({ quantity: e.target.value })}
              />

              <button style={styles.addBtn} onClick={this.handleAdd}>
                Add
              </button>
            </div>
          </div>

          {/* 购物车列表 */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Cart</div>
            {cart.length === 0 ? (
              <p style={styles.emptyMsg}>Your cart is empty.</p>
            ) : (
              cart.map(({ product, quantity }) => (
                <div key={product.id} style={styles.cartRow}>
                  <span style={styles.cartLabel}>
                    {product.name} × {quantity}
                  </span>
                  <div style={styles.cartRight}>
                    <span style={styles.cartPrice}>
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                    <button
                      style={styles.removeBtn}
                      onClick={() => this.handleRemove(product.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Total */}
          <div style={styles.totalCard}>
            <span style={styles.totalLabel}>Total:</span>
            <span style={styles.totalAmount}>${this.getTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default ShoppingCart;
