const itemsObject = [
  { quantity: 1, price: 200 },
  { quantity: 3, price: 350 },
  { quantity: 5, price: 400 },
];

// 1. Double quantity and price
const doubleItems = (arr) => arr.map(item => ({
  quantity: item.quantity * 2,
  price: item.price * 2,
}));

// 2. Filter quantity > 2 && price > 300
const filterItems = (arr) => arr.filter(
  item => item.quantity > 2 && item.price > 300
);

// 3. Total value
const totalValue = (arr) => arr.reduce(
  (sum, item) => sum + item.quantity * item.price,
  0
);

console.log(doubleItems(itemsObject));
console.log(filterItems(itemsObject));
console.log(totalValue(itemsObject));
