


const itemsObject = [
  { quantity: 1, price: 200 },
  { quantity: 3, price: 350 },
  { quantity: 5, price: 400 },
];

// 1. Double quantity and price
const doubledItems = itemsObject.map(item => ({
  quantity: item.quantity * 2,
  price: item.price * 2,
}));

console.log("Doubled Items:");
console.log(doubledItems);

// 2. Keep only items with quantity > 2 and price > 300
const filteredItems = itemsObject.filter(
  item => item.quantity > 2 && item.price > 300
);

console.log("\nFiltered Items:");
console.log(filteredItems);

// 3. Calculate total value of all items
const totalValue = itemsObject.reduce(
  (sum, item) => sum + item.quantity * item.price,
  0
);

console.log("\nTotal Value:");
console.log(totalValue);


