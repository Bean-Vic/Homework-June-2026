# Interview Questions on JavaScript

## 1. What is dynamic typing?

Dynamic typing means that data types are associated with the values themselves, rather than the variables. So you don't declare the data type when creating a variable, and the type checking happens at runtime.

JavaScript is dynamically typed, which means that you can assign a variable to one type of data, and then reassign that variable to another type of data without any errors.

## 2. Explain the difference between `var`, `let`, & `const`

We use `const` to declare variables that cannot be reassigned or redeclared. Once you assign a value to a const, it is locked in. `const` is the default choice for declaring a variable, due to its predictability.

If we know the value will be reassigned later, we will use `let` to declare it. `let` allows reassignment, but not redeclare.

`var`, is very different, is the legacy way of declaring variables. It allows both reassignment and redeclare. It is function-scoped or globally scoped, while `var` and `let` are block-scoped.

## 3. What is immutability? What data types in JS are immutable?

If a value is immutable, its data cannot be altered once it has been created in memory. We can not modify an immutable value, we can only create a new value in a new memory space, rather than changing the original one.

In JavaScript, all primitive data types are immutable. There are seven of them: Number, Boolean, String, Undefined, Null, Symbol, and BigInt.

## 4. What is the difference between `==` and `===`?

With three equal signs, it is called the Strict Equality Operator. It compares both the value and the data type.

With two equal signs, it is called the Loose Equality Operator. If it sees that you are comparing two different data types, it performs type coercion, meaning to convert one or both of them into a common type in the background, then check if they match.

## 5. What is the difference between `undefined` and `null`?

`undefined` and `null` are both primitive data type, and they both mean an absence of a value.

`undefined` means a variable has been declared, but has not been given a value. JavaScript assigns `undefined` to such a variable.

`null` is an intentional way to signify the absence of value. We assign `null` to a variable, but we don't assign `undefined` to a variable.

## 6. List falsy values in JS

There are six of them: `false`, `0`, `null`, `undefined`, `NaN` and `""` (empty string).

## 7. Explain hoisting in JavaScript

There are two kinds of hoisting in JavaScript.

One is for variables. Before execution, JavaScript will move the declarations of variables to the top of their scope. Only the declarations are hoisted, not the initializations.

Because of this, variables declared with keyword `var` will return `undefined` if accessed early. Variables declared with `let` or `const`, they are also hoisted, but if accessed early, JavaScript will throw a `ReferenceError`.

The other kind of hoisting is for functions. Function declarations are fully hoisted, which allows you to call them before they are defined.

## 8. Explain variable shadowing in JavaScript

Variable Shadowing is the situation that we declare a variable in an inner scope with the same name as a variable that already exists in the outer scope. The inner variable will hide or override the outer variable when we are in the inner scope.

## 9. What are 3 ways to declare functions?

First of all there is Function Declaration, using the `function` keyword followed by the name of the function.
Then there is Function Expression, that is to create an anonymous function and assign it to a variable, usually a `const` variable.
Finally there is Arrow Function, using an arrow `=>` between the parameters and the function body. It drops the `function` keyword and it provides a cleaner syntax.

## 10. What is a callback function?

A callback function is a function that is passed as an argument into another function, and to be executed inside that outer function. Callbacks are mostly used in Event Listeners, timers and array methods like `filter`.

## 11. What’s the difference between primitive data types and reference data types in JS?

Primitive types (String, Number, Boolean, Null, Undefined, Symbol, BigInt) are simple pieces of data. Because they take up a fixed amount of space, JavaScript stores them directly in the Stack. And they are passed by value.

Reference types, are Objects, Arrays, and Functions. Their actual data is stored the in the Heap. The variable itself doesn't hold the data; it holds a pointer (or you can say the address) to where the data lives in the Heap. Reference types are passed by reference.

## 12. What’s the difference between array for loop and `forEach()`?

`forEach()` is more concise but it is not as versatile or flexibile as the for loop. We can use the `forEach()` to run the callback function on every item of the array, but `forEach()` can't iterate backwards, and it can't stop early. And it doesn't work well with `async/await` because it fires off all callbacks at once and can't be paused.

## 13. What’s the difference between array `map()` and `forEach()`?

`map()` is for transforming the data in the array. It's much like the Stream in Java, it takes an array, applies a function, or a chain of functions, on every item, and returns a new array without mutating the original array.

`forEach()`, on the other hand, doesn't return anything, so we can't use it to return a new array based on the given array. The purpose of `forEach()` is to execute side effects, like logging to console, updating the DOM, or writing to database.

## 14. What is the difference between array `slice()` and `splice()`?

`slice()` returns a portion of an array and and it doesn't change the original array.

`splice()` is used to manipulate the array, you can use it to insert elements to the array or remove elements from the array at any position.

## 15. What is the `arguments` object?

The `arguments` object is an object available inside functions, it contains all arguments passed to the function. It is used when you wante to write a function that accepts an infinite number of parameters.
