const itemsObject = [
    { quantity: 1, price: 200},
    { quantity: 3, price: 350},
    { quantity: 5, price: 400},
]

function doubleItems(items) {
    return items.map((item) => {
        return {
            quantity: item.quantity * 2,
            price: item.price * 2,
        }
    })
}

const doubledItems = doubleItems(itemsObject);
console.log("Doubled items:", doubledItems);

function filterItems(items) {
    return items.filter((item => {
        return item.quantity > 2 && item.price > 300;
    }))
}

const filteredItems = filterItems(itemsObject);
console.log("Filtered items:", filteredItems);

function calculateTotalValue(items) {
    return items.reduce((total, item) => {
        return total + item.quantity * item.price;
    }, 0);
}

const totalValue = calculateTotalValue(itemsObject);
console.log("Total value:", totalValue);

const string =
  " Perhaps The Easiest-to-understand Case For Reduce Is To Return The Sum Of All The Elements In An Array ";
  function cleanString(text) {
    return text.replaceAll("-", " ").trim().toLowerCase();
  }
const cleanedString = cleanString(string);
console.log("Cleaned string:", cleanedString);

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
function mergeArrays(first, second) {
    const uuids = [...new Set([...first, ...second].map((item) => item.uuid))];
    const mergedArray = uuids.map((uuid) => {
        const firstItem = first.find(item => item.uuid === uuid);
        const secondItem = second.find(item => item.uuid === uuid);
        return { uuid: uuid, name: firstItem?.name ?? null, role: secondItem?.role ?? null};
    })
    return mergedArray.sort((a, b) => a.uuid - b.uuid);
}
const mergedResult = mergeArrays(first, second);
console.log("Merged result:", mergedResult);