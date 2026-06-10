const itemsObject = [
	{ quantity: 1, price: 200 },
	{ quantity: 3, price: 350 },
	{ quantity: 5, price: 400 },
];

function doubleQuantityPrice(items) {
    return items.map(item => {
        return {
            quantity: item.quantity * 2,
            price: item.price * 2
        };
    });
}

const doubleQuantityPriceObject = doubleQuantityPrice(itemsObject);
console.log(doubleQuantityPriceObject);

function filteredItems(items) {
    return items.filter(item =>
        item.quantity > 2 && item.price > 300
    );
}

const filteredItemsObject = filteredItems(itemsObject);
console.log(filteredItemsObject);

function totalPrice(items) {
    return items.reduce((total, item) => {
        return total + (item.quantity * item.price);
    }, 0);
}
const totalPriceValue = totalPrice(itemsObject);
console.log(totalPriceValue);