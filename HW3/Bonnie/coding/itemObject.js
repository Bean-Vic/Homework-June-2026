


const itemsObject = [
{ quantity: 1, price: 200 },
{ quantity: 3, price: 350 },
{ quantity: 5, price: 400 },
];

// Given the array, implement a function for generating a new array which
// doubles the quantity and price in each object.
//double the quantity and price in each object
function doubles(itemsObject){

    let result = itemsObject
    return itemsObject.map(element=>({
        quantity:element.quantity *2,
        price:element.price * 2,
    }));

   
}
 console.log(doubles(itemsObject));

 // Given the array, implement a function for generating a new array which
// contains item quantity > 2 and price > 300 only.
function filters(itemsObject){
    return itemsObject.filter(element=>
        element.quantity>2 && element.price>300
   )
}
console.log(filters(itemsObject));

// Given the array, implement a function to calculate the total value of the items
function calculate(itemsObect){
    return itemsObject.reduce((acc,cur)=>
        acc+cur.quantity*cur.price, 0
    )
}
console.log(calculate(itemsObject))

