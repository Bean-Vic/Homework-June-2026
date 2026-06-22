const itemsObject = [
  { quantity: 1, price: 200 },
  { quantity: 3, price: 350 },
  { quantity: 5, price: 400 },
];
function doubleItems(items) {
  let result = [];
  for (let i = 0; i < items.length; i++) {
    let newItem = {
      quantity: items[i].quantity * 2,
      price: items[i].price * 2,
    };
    result.push(newItem);
  }
  return result;
}

function filterItems(items) {
  let result = [];
  for (let i = 0; i < items.length; i++) {
    if (items[i].quantity > 2 && items[i].price > 300) {
      result.push(items[i]);
    }
  }
  return result;
}

function calculateTotalValue(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].quantity * items[i].price;
  }
  return total;
}
