## 1. What is dynamic typing?

Dynamic typing means JavaScript does not need me to decide the variable type first. The type is based on the value when the code is running.
For example, I can write a variable as a number first, and later change it to a string.
This makes JavaScript easier and more flexible to use, but sometimes it can also cause mistakes if I forget what type the value is.

## 2. Explain the difference between var, let, and const.

var, let, and const are all used to declare variables.
var is function-scoped and can be re-declared, so it can sometimes cause confusion.
let is block-scoped, and I can reassign it.
const is also block-scoped, but I cannot reassign it.
So in real code, I usually use const first, and use let only when the value needs to change.

## 3. What is immutability? What data types in JS are immutable?

Immutability means a value cannot be changed directly after it is created. In JavaScript, primitive types are immutable, like string, number, boolean, null, undefined, symbol, and bigint. When we “change” a string, JavaScript actually creates a new value.
I remember it as: primitive values are immutable, but objects and arrays are mutable.

## 4. What is the difference between == and ===?

==(double equals) compares values after type conversion.
===(triple equals) compares both value and type.
For example, 5 == "5" is true, because JavaScript converts the string to a number. But 5 === "5" is false,because one is a number and one is a string. I usually prefer === because it is safer and more predictable.

## 5. What is the difference between undefined and null?

undefined usually means a variable was declared, but it has not been assigned a value.
null means the developer intentionally sets the value to empty. I think of undefined as “no value yet,” and null as “intentionally empty.” That is the main difference for me.

## 6. List falsy values in JS.

Falsy values are values that become false in a boolean condition. They are false, 0, -0(negative zero), 0n, empty string, null, undefined, and NaN. One thing to remember is that empty arrays and empty objects are truthy.
So falsy values are only a small group of special values in JavaScript.

## 7. Explain hoisting in JavaScript.

Hoisting means JavaScript prepares declarations before running the code. For var, the declaration is hoisted and initialized as undefined. For let and const, they are also hoisted, but we cannot use them before the declaration because of the temporal dead zone. Function declarations are also hoisted.
So hoisting is basically how JavaScript handles declarations before execution.

## 8. Explain variable shadowing in JavaScript.

Variable shadowing happens when an inner variable has the same name as an outer variable.
For example, if I have a name variable outside a function, and another name inside the function, the inner one hides the outer one in that scope. It is allowed, but it can make code harder to read if we use it too much.
I try to avoid shadowing unless it is really clear.

## 9. What are 3 ways to declare functions?

There are three common ways to declare functions in JavaScript. The first one is a function declaration. The second one is a function expression. The third one is an arrow function.
Function declarations are hoisted, but function expressions and arrow functions should be used after they are assigned. So I choose the style based on readability and the situation.

## 10. What is a callback function?

A callback function is a function passed into another function as an argument. The other function can call it later. When we add a click event to a button, we pass a callback function that runs after the user clicks.
So a callback is basically a function that we give to another function to run later.

## 11. What’s the difference between primitive data types and reference data types in JS?

Primitive data types store simple values directly, like string, number, boolean, null, undefined, symbol, and bigint. Reference data types store references to objects in memory, like objects, arrays, and functions.
When we copy a primitive value, we get a separate value. But when we copy an object or array, both variables may point to the same object. Primitives are copied by value, and objects are copied by reference.

## 12. What’s the difference between array for loop and forEach?

A regular for loop gives me more control. I can use an index, break, continue, and stop the loop early.
forEach is cleaner when I just want to run something for every item, but I cannot use break to stop it early.
If I need more control, I use a for loop. If I just need to visit each item, forEach is fine.

## 13. What’s the difference between array map and forEach?

forEach is used to loop through an array and do some action. map is used to transform each item and return a new array. For example, if I want to double every number and get a new array, I would use map.
So I remember it this way: forEach is for doing something, and map is for creating a new array.

## 14. What is the difference between array slice and splice?

slice returns a copy of part of an array, and it does not change the original array. splice changes the original array. It can remove, replace, or add items. The biggest difference is that slice is non-mutating, and splice is mutating. That is the simple way I remember it.

## 15. What is an arguments object?

The arguments object is an array-like object inside regular functions. It contains all the values passed into the function. It is array-like because it has indexes and a length, but it is not a real array, so it does not have all array methods like map. In modern JavaScript, I usually prefer rest parameters, because they give us a real array. So arguments is useful to know, but rest parameters are cleaner in newer code.
