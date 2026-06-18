const itemsObject = [
  { quantity: 1, price: 200 },
  { quantity: 3, price: 350 },
  { quantity: 5, price: 400 },
];

function doubleItems(items) {
  return items.map((item) => ({
    quantity: item.quantity * 2,
    price: item.price * 2,
  }));
}

function filterItems(items) {
  return items.filter((item) => item.quantity > 2 && item.price > 300);
}

function calculateTotalValue(items) {
  return items.reduce((total, item) => total + item.quantity * item.price, 0);
}

const string =
  " Perhaps The Easiest-to-understand Case For Reduce Is To Return The Sum Of All The Elements In An Array  ";

function cleanString(str) {
  return str
    .replace(/[^a-zA-Z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

const first = [
  { uuid: 2, name: "test" },
  { uuid: 5, name: "test5" },
  { uuid: 3, name: "test3" },
];

const second = [
  { uuid: 6, role: "pm" },
  { uuid: 4, role: "engineer" },
  { uuid: 1, role: "manager" },
  { uuid: 2, role: "associate" },
];

function mergeByUuid(firstItems, secondItems) {
  const itemsByUuid = new Map();

  firstItems.forEach((item) => {
    itemsByUuid.set(item.uuid, {
      uuid: item.uuid,
      name: item.name,
      role: null,
    });
  });

  secondItems.forEach((item) => {
    const existingItem = itemsByUuid.get(item.uuid);

    itemsByUuid.set(item.uuid, {
      uuid: item.uuid,
      name: existingItem ? existingItem.name : null,
      role: item.role,
    });
  });

  return Array.from(itemsByUuid.values()).sort((a, b) => a.uuid - b.uuid);
}

console.log("Doubled items:", doubleItems(itemsObject));
console.log("Filtered items:", filterItems(itemsObject));
console.log("Total value:", calculateTotalValue(itemsObject));
console.log("Clean string:", cleanString(string));
console.log("Merged arrays:", mergeByUuid(first, second));
