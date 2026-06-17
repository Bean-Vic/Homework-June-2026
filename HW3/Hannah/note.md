1. What is dynamic typing?
   Variables in JavaScript are not directly associated with any particular value type, and any variable can be assigned(and re-assigned) values of all types.
2. Explain the difference between var, let, & const.
   The differences mainly fall into two catogories, variable declarations and hoisting. var is functional scope, while let and const are block scope ({}). var supports hoisting, and if used before its declaration, the initialization of var is undefined. However, even let and const also support hoisting, the values of them are not initialized, if used before declacaration, it will throw reference error.
3. What is immutability? What data types in JS are immutable?
   Immutability means a variable's value can't be changed, after it's been declared. Primitive data types are immutable, while objects/arrays are mutable by default.
4. What is the difference between == and ===?
   == is loose equality, which means performing type conversion before comparing, so only comparing the values of the operands, not the types. === is strict equality, which means comparing not only the values, but also the types.
5. What is the difference between undefined and null?
   undefined means a variable is declared, but not assigned any values, usually set by javascript, and the type of undefined is undefined. However, null is an intentional opration to set a variable, usually by developers, and the type of null is an object.
6. List falsy values in JS.
   false(boolean), 0, "", null, undefined, NaN.
7. Explain hoisting in JavaScript.
   Hoisting can be either variable or funtion, and before code execution, javascript process and hoist variable and function declarations, but not the values.
8. Explain variable shadowing in JavaScript.
   It means we declare the same name of the variable in innner and outer scope, but they are inaccessible with each other, so they have independent values.
9. What are 3 ways to declare functions?
   funciton declaration, function expression, arrow function
10. What is a callback function?
    It's a function that's passed into another function as an argument to be executed later.
11. What’s the difference between primitive data types and reference data types in JS?
    The key difference is copying. For primitive data types, only copy the value of the variable, so the original variable's value does not change. For reference data types, it copies the same reference/address, so once the copied value is modified, the reference data also is modified.
12. What’s the difference between array for loop and forEach?
    For loop has more controls such as using break/continue. ForEach is more concise, but does not support break/continue.
13. What’s the difference between array map and forEach?
    Map return a value, while forEach doesn't. Map doesn't mutate the original data, while forEach can mutate the original data. Map can chain other funtions, while forEach can't.
14. What is the difference between array slice and splice?
    slice doesn't change the source data, and returns an array. splice changes the source data, and returns an array containing the deleted elements.
15. What is an arguments object?
    It's an array like object available inside functions, which contains all arguments passed to the functions.
