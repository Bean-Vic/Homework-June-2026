1. What is dynamic typing?
In JavaScript, we don't declare variable types upfront. The type is determined at runtime based on the value, and it can change as we reassign. So a variable can hold a string first, then a number later — JavaScript figures it out on the fly.

2. Explain the difference between var, let, & const.
var is function-scoped and gets hoisted with an undefined value. let and const are block-scoped and live in the temporal dead zone until declared. The main difference between the two is that const can't be reassigned, but if it holds an object, we can still mutate its properties.

3. What is immutability? What data types in JS are immutable?
Immutability means once a value is created, it can't be changed. In JavaScript, all primitives are immutable — strings, numbers, booleans, null, undefined, symbols, and bigints. Objects and arrays are mutable, so we can change their contents in place.

4. What is the difference between == and ===?
== is loose equality — it does type coercion before comparing, so "5" == 5 is true. === is strict equality — it checks both type and value, no coercion. As a best practice, we almost always use === to avoid surprises.

5. What is the difference between undefined and null?
undefined means a variable has been declared but no value assigned — it's JavaScript's default. null is an intentional "no value" that we as developers assign on purpose. One quirk: typeof null returns "object", which is a well-known historical bug.

6. List false values in JS.
There are six: false, 0, "" (empty string), null, undefined, and NaN. Plus 0n if we count BigInt. Everything else is truthy — including empty arrays and empty objects, which surprises a lot of people.

7. Explain hoisting in JavaScript.
Hoisting means declarations get moved to the top of their scope before code runs. var declarations are hoisted and initialized as undefined. Function declarations are fully hoisted, so we can call them before they appear. let and const are hoisted too, but stay in the temporal dead zone until the line they're declared on.

8. Explain variable shadowing in JavaScript.
Shadowing happens when a variable in an inner scope has the same name as one in an outer scope — the inner one takes precedence inside that block. It's legal, but it can make code confusing. As a rule of thumb, we try to avoid it for readability.

9. What are 3 ways to declare functions?
Function declarations like function foo() {}, function expressions like const foo = function() {}, and arrow functions like const foo = () => {}. The main differences are that declarations are hoisted, and arrows don't bind their own this or arguments.

10. What is a callback function?
A callback is a function we pass as an argument to another function, to be called later. It's the foundation of asynchronous JavaScript — think setTimeout, event handlers, or array methods like map and forEach.

11. What’s the difference between primitive data types and reference data types in JS?
Primitives — strings, numbers, booleans, etc. — are stored by value, so assigning one creates a copy. Reference types like objects and arrays are stored by reference, so assigning just copies the pointer. That's why mutating one variable can affect another if they point to the same object.

12. What’s the difference between array for loop and forEach?
A for loop is more flexible — we can break, continue, or return early from the enclosing function. forEach is cleaner syntactically but we can't break out of it, and it doesn't work well with async/await. For simple iteration forEach is nice; for control flow, for or for...of is better.

13. What’s the difference between array map and forEach?
Both iterate over an array, but map returns a new array with the transformed values, while forEach returns undefined. So we use map when we want to transform data, and forEach when we just want to perform side effects like logging.

14. What is the difference between array slice and splice?
slice is non-destructive — it returns a shallow copy of a portion of the array without touching the original. splice mutates the original array — it can remove, replace, or insert elements in place. Easy way to remember: slice is safe, splice is surgery.

15. What is an arguments object?
arguments is an array-like object available inside regular functions that holds all the arguments passed in. It's not a real array, so it doesn't have methods like map. Modern code usually skips it in favor of rest parameters ...args, and note that arrow functions don't have it at all.
