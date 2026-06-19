# HW3 Q & A

## 1. What is dynamic typing?

Dynamic typing means a variable can hold different types of values while the program is running.

For example, in JavaScript, a variable can be a number first and later become a string.

## 2. Explain the difference between `var`, `let`, and `const`.

`var` is function-scoped and can be redeclared. It is older and easier to cause bugs.

`let` is block-scoped and can be reassigned.

`const` is block-scoped and cannot be reassigned. But if it stores an object or array, the contents can still be changed.

In practice, I usually use `const` by default, use `let` only when I need to reassign the variable, and avoid `var` in modern JavaScript.

## 3. What is immutability? What data types in JS are immutable?

Immutability means a value cannot be changed after it is created.

In JavaScript, primitive values are immutable, like string, number, boolean, null, undefined, symbol, and bigint.

Objects and arrays are mutable.

## 4. What is the difference between `==` and `===`?

`==` compares values after type conversion.

`===` compares both value and type without type conversion.

In most cases, we should use `===` because it is safer and clearer.

## 5. What is the difference between `undefined` and `null`?

`undefined` usually means a value has not been assigned yet.

`null` means we intentionally set the value to empty.

## 6. List falsy values in JS.

The falsy values in JavaScript are `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, and `NaN`.

## 7. Explain hoisting in JavaScript.

Hoisting means JavaScript moves declarations to the top of their scope during compilation.

`var` is hoisted and initialized as `undefined`.

`let` and `const` are also hoisted, but we cannot use them before declaration because of the temporal dead zone.

Function declarations are hoisted too, so we can call them before they appear in the code.

## 8. Explain variable shadowing in JavaScript.

Variable shadowing happens when an inner scope has a variable with the same name as an outer scope.

The inner variable hides the outer variable inside that block or function.

## 9. What are 3 ways to declare functions?

A function declaration is a syntax to declare a named function.

A function expression assigns a function to a variable.

An arrow function is a shorter syntax for a function expression, but it behaves differently with `this` and `arguments`.

```js
function sayHi() {}

const sayHello = function () {};

const sayHey = () => {};
```

## 10. What is a callback function?

A callback function is a function passed into another function as an argument.

It is usually called later, after something happens, like a click event, timer, or async operation.

## 11. What's the difference between primitive data types and reference data types in JS?

Primitive values store the actual value directly. Examples are string, number, boolean, null, undefined, symbol, and bigint.

Reference values store a reference to the object in memory. Examples are objects, arrays, and functions.

When we copy a primitive value, we copy the value. When we copy a reference value, we copy the reference.

## 12. What's the difference between array `for` loop and `forEach`?

A `for` loop gives us more control. We can use `break`, `continue`, and control the index manually.

`forEach` is cleaner for simple iteration, but we cannot stop it early with `break`.

## 13. What's the difference between array `map` and `forEach`?

`map` returns a new array based on the original array.

`forEach` only loops through the array and does not return a useful value.

Use `map` when we want transformed data. Use `forEach` when we just want to do something for each item.

## 14. What is the difference between array `slice` and `splice`?

`slice` returns a copy of part of an array and does not change the original array.

`splice` changes the original array by adding, removing, or replacing elements.

## 15. What is an arguments object?

The `arguments` object is an array-like object available inside regular functions.

It contains all arguments passed into the function.

It is not a real array, and arrow functions do not have their own `arguments` object.

In modern JavaScript, rest parameters like `...args` are usually preferred because they create a real array.
