

1. **What is dynamic typing?**  
Dynamic typing means a variable's type is determined at runtime and can change when a new value is assigned.

2. **Explain the difference between `var`, `let`, and `const`.**  
`var` is function-scoped and hoisted with `undefined`, `let` is block-scoped and reassignable, and `const` is block-scoped and cannot be reassigned after initialization.

3. **What is immutability? What data types in JS are immutable?**  
Immutability means a value cannot be changed after it is created, and all JavaScript primitive values such as `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, and `null` are immutable.

4. **What is the difference between `==` and `===`?**  
`==` compares values after type coercion, while `===` compares both value and type without coercion.

5. **What is the difference between `undefined` and `null`?**  
`undefined` usually means a value has not been assigned, while `null` is an intentional empty value assigned by the developer.

6. **List falsy values in JS.**  
The falsy values in JavaScript are `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`, and the legacy browser object `document.all`.

7. **Explain hoisting in JavaScript.**  
Hoisting is JavaScript's behavior of processing declarations before code runs, where `var` is initialized as `undefined`, `let` and `const` stay in the temporal dead zone, and function declarations are fully hoisted.

8. **Explain variable shadowing in JavaScript.**  
Variable shadowing happens when an inner-scope variable has the same name as an outer-scope variable and temporarily hides the outer one.

9. **What are 3 ways to declare functions?**  
Three common ways to declare functions are function declarations, function expressions, and arrow functions.

10. **What is a callback function?**  
A callback function is a function passed into another function to be executed later.

11. **What's the difference between primitive data types and reference data types in JS?**  
Primitive values are stored and copied by value, while reference data types such as objects and arrays are stored and copied by reference.

12. **What's the difference between array `for` loop and `forEach`?**  
A `for` loop gives more control such as `break`, `continue`, and custom indexing, while `forEach` runs a callback for each array item and cannot be stopped early with `break`.

13. **What's the difference between array `map` and `forEach`?**  
`map` returns a new array from the callback results, while `forEach` only iterates and returns `undefined`.

14. **What is the difference between array `slice` and `splice`?**  
`slice` returns a shallow copy without changing the original array, while `splice` changes the original array by adding, removing, or replacing elements.

15. **What is an arguments object?**  
The `arguments` object is an array-like object available inside regular functions that contains all arguments passed to the function.
