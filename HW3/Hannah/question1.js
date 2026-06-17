//```jsx
const itemsObject = [
  { quantity: 1, price: 200 },
  { quantity: 3, price: 350 },
  { quantity: 5, price: 400 },
];
//```;

// Given the array, implement a function for generating a new array which doubles the quantity and price in each object.

const doubleValue = itemsObject.map((ele) => ({
  quantity: ele.quantity * 2,
  price: ele.price * 2,
}));
console.log(doubleValue);

// Given the array, implement a function for generating a new array which contains item quantity > 2 and price > 300 only.

const filterItem = itemsObject.filter(
  (ele) => ele.quantity > 2 && ele.price > 300,
);
console.log(filterItem);

// Given the array, implement a function to calculate the total value of the items.

const totalValue = itemsObject.reduce(
  (acc, ele) => acc + ele.quantity * ele.price,
  0,
);
console.log(totalValue);
