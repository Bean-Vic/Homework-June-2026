


# JavaScript Interview Questions

## 1. What is dynamic typing?

Dynamic typing is a feature of some programming languages where the type of a variable is determined at runtime, not when the code is written or compiled.
This means you can assign different kinds of values to the same variable without explicitly declaring its type.
```
x = 10        # x is an integer
x = "Hello"   # now x is a string
x = 3.14      # now x is a float
```

## 2. Explain the difference between `var`, `let`, and `const`.

1. scope

var is function scoped.
```
if (true) {
    var x = 10;
}
console.log(x); // 10
```

let, const is block scoped.
```
if (true) {
    let y = 20;
}
console.log(y); // ReferenceError

if (true) {
    const z = 30;
}
console.log(z); // ReferenceError
```

2. Reassignment

Var, let allows reassignment.
const doesn't.

3. redeclaration

var allows it.
```
var x = 1;
var x = 2;

console.log(x); // 2
```

let, const does not allow it.
```
let y = 1;
let y = 2; // Error

const z = 1;
const z = 2; // Error
```

## 3. What is immutability? What data types in JS are immutable?

Immutability means that once a value is created, it cannot be changed. If you "modify" it, JavaScript actually creates a new value instead.

All primitive values are immutable:
string
number
boolean

Objects are mutable:
Objects ({})
Arrays ([])
Functions
Dates
Maps
Sets

## 4. What is the difference between `==` and `===`?

=== (Strict Equality)
Checks:
Same type
Same value
```
5 === 5          // true
5 === "5"        // false
true === 1       // false
null === undefined // false
```

== (Loose Equality)
Checks equality after attempting type coercion.
```
5 == "5"      // true
true == 1     // true
false == 0    // true
```

## 5. What is the difference between `undefined` and `null`?

undefined means a value has not been assigned yet, and JavaScript typically sets it automatically. null means the programmer intentionally assigned an empty value. typeof undefined is "undefined", while typeof null is "object" due to a historical JavaScript quirk. null == undefined is true, but null === undefined is false.

## 6. List falsy values in JavaScript.

The falsy values in JavaScript are values that convert to false in a Boolean context.

```
false
0
-0
0n      // BigInt zero
""      // Empty string
null
undefined
NaN
```

## 7. Explain hoisting in JavaScript.

Hoisting is JavaScript's behavior of moving declarations to the top of their scope before code execution.
```
// what's written.
console.log(x); // undefined

var x = 5;



// what js sees.
var x;

console.log(x); // undefined

x = 5;
```

## 8. Explain variable shadowing in JavaScript.

Variable shadowing occurs when a variable declared in an inner scope has the same name as a variable in an outer scope.
The inner variable shadows (hides) the outer variable within that scope.

```
let name = "Alice";

function greet() {
    let name = "Bob"; // shadows outer variable
    console.log(name);
}

greet();      // Bob
console.log(name); // Alice
```

## 9. What are 3 ways to declare functions?
// hu: dig deep into this later. /
especially Arrow Function.

1. Function Declaration
```
function greet(name) {
    return `Hello, ${name}`;
}
```

2. Function Expression
```
const greet = function(name) {
    return `Hello, ${name}`;
};
```

3. Arrow Function
```
const greet = (name) => {
    return `Hello, ${name}`;
};
```

## 10. What is a callback function?
// hu: dig deep into this later.

A callback function is a function that is passed as an argument to another function and is executed later.

```
function greet(name) {
    console.log(`Hello, ${name}`);
}

function processUser(callback) {
    callback("Alice");
}

processUser(greet);
```

## 11. What's the difference between primitive data types and reference data types in JavaScript?
// hu: dig deep into this later.

Primitive Data Types
Primitives store the actual value directly.
```
string
number
boolean
undefined
null
symbol
bigint
```

Reference Data Types
Objects are stored by reference (memory address).
```
Object
Array
Function
Date
Map
Set
```

## 12. What's the difference between an array `for` loop and `forEach()`?

A for loop provides full control over iteration and supports break, continue, reverse traversal, and await. forEach() is more concise and readable but cannot be exited early and doesn't work naturally with asynchronous await operations. For simple iteration, forEach() is convenient; for more control, use a for loop or for...of.

## 13. What's the difference between array `map()` and `forEach()`?

map()
Use map() when you want to transform every element and create a new array.
```
const nums = [1, 2, 3];

const doubled = nums.map(num => num * 2);

console.log(doubled);
// [2, 4, 6]
```

forEach()
Use forEach() when you just want to do something with each element.
```
const nums = [1, 2, 3];

nums.forEach(num => {
    console.log(num * 2);
});
```

## 14. What is the difference between array `slice()` and `splice()`?

The key difference:
slice() does NOT modify the original array.
splice() DOES modify the original array.

slice()
Returns a shallow copy of a portion of an array.
```
const arr = [1, 2, 3, 4, 5];

const result = arr.slice(1, 4);

console.log(result);
// [2, 3, 4]

console.log(arr);
// [1, 2, 3, 4, 5]
```

splice()
array.splice(start, deleteCount, item1, item2, ...)
Adds, removes, or replaces elements in the original array.
```
const arr = [1, 2, 3, 4, 5];

const removed = arr.splice(1, 2);

console.log(removed);
// [2, 3]

console.log(arr);
// [1, 4, 5]
```

## 15. What is an `arguments` object?

The arguments object is a special array-like object available inside regular functions that contains all arguments passed to that function.

```
function greet() {
    console.log(arguments);
}

greet("Alice", 25, true);

{
  0: "Alice",
  1: 25,
  2: true,
  length: 3
}
```