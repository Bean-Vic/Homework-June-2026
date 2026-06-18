# JavaScript Basics Notes

## 1. What is dynamic typing?

Dynamic typing means a variable can hold different types of values at different times. JavaScript checks the value type while the program is running.

```js
let value = 10;      // number
value = "hello";     // string
value = true;        // boolean
```

---

## 2. Difference between `var`, `let`, and `const`

| Keyword | Scope | Can reassign? | Can redeclare? | Hoisted? |
|---|---|---:|---:|---:|
| `var` | Function scope | Yes | Yes | Yes, initialized as `undefined` |
| `let` | Block scope | Yes | No | Yes, but in Temporal Dead Zone |
| `const` | Block scope | No | No | Yes, but in Temporal Dead Zone |

```js
var a = 1;
let b = 2;
const c = 3;
```

Use `let` when the value changes. Use `const` by default when the variable should not be reassigned. Avoid `var` in modern JavaScript.

---

## 3. What is immutability? What data types in JS are immutable?

Immutability means a value cannot be changed after it is created.

Primitive values are immutable in JavaScript:

- `string`
- `number`
- `boolean`
- `undefined`
- `null`
- `bigint`
- `symbol`

Example:

```js
let name = "cat";
name.toUpperCase();

console.log(name); // "cat"
```

The original string does not change.

Objects and arrays are mutable by default:

```js
const arr = [1, 2, 3];
arr.push(4);

console.log(arr); // [1, 2, 3, 4]
```

---

## 4. Difference between `==` and `===`

`==` checks equality after type conversion.

`===` checks equality without type conversion.

```js
5 == "5";   // true
5 === "5";  // false
```

Use `===` in most cases because it is safer and clearer.

---

## 5. Difference between `undefined` and `null`

`undefined` means a variable has been declared but has not been assigned a value.

```js
let x;
console.log(x); // undefined
```

`null` is an intentional empty value.

```js
let user = null;
```

Simple rule:

- `undefined`: JavaScript says “no value assigned.”
- `null`: developer says “intentionally empty.”

---

## 6. Falsy values in JavaScript

Falsy values are values that become `false` in a boolean context.

There are 8 falsy values:

```js
false
0
-0
0n
""
null
undefined
NaN
```

Example:

```js
if ("") {
  console.log("runs");
} else {
  console.log("does not run");
}
```

---

## 7. Explain hoisting in JavaScript

Hoisting means JavaScript moves declarations to the top of their scope during compilation.

With `var`:

```js
console.log(x); // undefined
var x = 5;
```

JavaScript treats it like:

```js
var x;
console.log(x);
x = 5;
```

With `let` and `const`, declarations are also hoisted, but they cannot be used before declaration because they are in the Temporal Dead Zone.

```js
console.log(y); // ReferenceError
let y = 10;
```

Function declarations are fully hoisted:

```js
sayHi();

function sayHi() {
  console.log("Hi");
}
```

---

## 8. Explain variable shadowing in JavaScript

Variable shadowing happens when an inner-scope variable has the same name as an outer-scope variable. The inner variable hides the outer one inside that scope.

```js
let name = "Alice";

function greet() {
  let name = "Bob";
  console.log(name); // "Bob"
}

greet();
console.log(name); // "Alice"
```

---

## 9. Three ways to declare functions

### Function declaration

```js
function add(a, b) {
  return a + b;
}
```

### Function expression

```js
const add = function(a, b) {
  return a + b;
};
```

### Arrow function

```js
const add = (a, b) => {
  return a + b;
};
```

Shorter arrow function:

```js
const add = (a, b) => a + b;
```

---

## 10. What is a callback function?

A callback function is a function passed into another function as an argument. It is usually called later.

```js
function greet(name, callback) {
  console.log("Hi " + name);
  callback();
}

function sayBye() {
  console.log("Bye");
}

greet("Alice", sayBye);
```

Common example:

```js
[1, 2, 3].forEach(function(num) {
  console.log(num);
});
```

The function passed to `forEach` is a callback.

---

## 11. Primitive data types vs reference data types

Primitive values are stored as simple values.

Primitive types:

- `string`
- `number`
- `boolean`
- `undefined`
- `null`
- `bigint`
- `symbol`

Reference types are stored by reference.

Reference types:

- objects
- arrays
- functions

Example:

```js
let a = 10;
let b = a;
b = 20;

console.log(a); // 10
```

For objects:

```js
let obj1 = { name: "Alice" };
let obj2 = obj1;

obj2.name = "Bob";

console.log(obj1.name); // "Bob"
```

`obj1` and `obj2` point to the same object.

---

## 12. Difference between array `for` loop and `forEach`

A `for` loop gives more control. You can use `break`, `continue`, and custom index logic.

```js
const nums = [1, 2, 3];

for (let i = 0; i < nums.length; i++) {
  console.log(nums[i]);
}
```

`forEach` is cleaner for running a function on each item.

```js
nums.forEach(function(num) {
  console.log(num);
});
```

Main difference:

- `for`: more control, supports `break` and `continue`
- `forEach`: cleaner, but cannot use `break` or `continue`

---

## 13. Difference between array `map` and `forEach`

`forEach` runs a function for each item but does not return a new array.

```js
const nums = [1, 2, 3];

nums.forEach(num => console.log(num));
```

`map` creates and returns a new array.

```js
const doubled = nums.map(num => num * 2);

console.log(doubled); // [2, 4, 6]
```

Use `map` when you want to transform an array. Use `forEach` when you only want to perform an action.

---

## 14. Difference between array `slice` and `splice`

`slice` copies part of an array and does not change the original array.

```js
const nums = [1, 2, 3, 4];

const result = nums.slice(1, 3);

console.log(result); // [2, 3]
console.log(nums);   // [1, 2, 3, 4]
```

`splice` changes the original array by adding, removing, or replacing items.

```js
const nums = [1, 2, 3, 4];

nums.splice(1, 2);

console.log(nums); // [1, 4]
```

Simple rule:

- `slice`: does not mutate
- `splice`: mutates

---

## 15. What is an arguments object?

The `arguments` object is an array-like object available inside regular functions. It contains all arguments passed to the function.

```js
function showArgs() {
  console.log(arguments);
}

showArgs("a", "b", "c");
```

It is array-like, but not a real array.

```js
function sum() {
  const args = Array.from(arguments);
  return args.reduce((total, num) => total + num, 0);
}
```

Arrow functions do not have their own `arguments` object.

Modern JavaScript often uses rest parameters instead:

```js
function sum(...nums) {
  return nums.reduce((total, num) => total + num, 0);
}
```
