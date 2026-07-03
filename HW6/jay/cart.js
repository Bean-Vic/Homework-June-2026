// Data + pure helpers for the Mini Shopping Cart component.
// Kept separate so the cart logic can be reasoned about (and tested)
// independently of the React UI.

export const PRODUCTS = [
  { id: "coffee", name: "Coffee", price: 4.5 },
  { id: "bagel", name: "Bagel", price: 3.25 },
  { id: "muffin", name: "Muffin", price: 2.75 },
  { id: "tea", name: "Tea", price: 3.0 },
];

// Add `product` to the cart. If it is already there, bump its quantity.
// `quantity` may arrive as a string (straight from an <input>), so coerce it.
export function addProduct(cart, product, quantity) {
  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1) return cart;

  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    return cart.map((item) =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + qty }
        : item,
    );
  }

  return [...cart, { ...product, quantity: qty }];
}

// Remove a line item by product id.
export function removeProduct(cart, id) {
  return cart.filter((item) => item.id !== id);
}

// Sum of price * quantity across the whole cart.
export function calculateTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
