const itemsObject = [
  { quantity: 1, price: 200 },
  { quantity: 3, price: 350 },
  { quantity: 5, price: 400 },
];
const doubleItems = (items) =>
  items.map((item) => ({
    quantity: item.quantity * 2,
    price: item.price * 2,
  }));
const filterItems = (items) =>
  items.filter((item) => item.quantity > 2 && item.price > 300);
const calculateTotalValue = (items) =>
  items.reduce((total, item) => total + item.quantity * item.price, 0);
