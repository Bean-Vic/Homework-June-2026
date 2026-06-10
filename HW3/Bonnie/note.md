JS mock
1. What is dynamic typing?
JSvascript is a dynamic language.Dynamic typing meanings the data type could be changed after initialization. 

2. Explain the difference between var, let, & const.
var: function scoped; can be hosting to the top of function and will be initialized as undefined; can be reassigned and redeclared.
let: block scoped;  is hoisted but stays in the Temporal Dead Zone before initialization, so we cannot access it before declaration; can be reassigned but cannot be redeclared in the same scope. 
const: block scoped; It is also hoisted and stays in the TDZ before initialization. It must be initialized when declared and cannot be reassigned.

3. What is immutability? What data types in JS are immutable?
imutability means the value cannot be deirectly changed after it is created. In JS, primtive value types are imutable, like String, number, bollean, bigint,symbol,undefined, null.

Objects and arrays are mutable because their properties or elements can be changed.

4. What is the difference between == and ===?
==: campares values afer type conversion
===: campares both value and type

5. What is difference between undefined and null?
undefined means a variable has been declared but has not been assigned a value.
null means we intentionally assign an empty value.
undefined is usually set by JavaScript.
null is usually set by developers.

6. List falsy values in JS.
false, 0, -0, 0n, "", null, undefined, NaN

7. Explain hoisting in JavaScript.
Hoisting means JavaScript moves variable and function declarations to the top of their scope during compilation.

var is hoisted and initialized as undefined.
let and const are hoisted but stay in the Temporal Dead Zone.
Function declarations are fully hoisted.

8. Explain variable shadowing in Javascript.
Variable shadowing happens when an inner-scope variable has the same name as an outer-scope variable.
The inner variable hides the outer variable inside that scope.

9. What are 3 ways to declare functions?
    1. Function Declaration：A function is declared using the function keyword and can be called before its declaration because it is hoisted.
    2. Function Expression：A function is assigned to a variable. The variable is hoisted, but the function itself is not initialized until the assignment happens.
    3. Arrow Function：Arrow functions provide a shorter syntax. Unlike regular functions, they do not have their own this or arguments object.

10. What is a callback function?
A callback function is a function passed into another function as an argument, and it is called later.

11. What’s the difference between primitive data types and reference data
types in JS?
Primitive types store actual values and are immutable.
Reference types store references to objects in memory and are mutable.

12. What’s the difference between array for loop and forEach?
A for loop gives more control. We can use break, continue, and return.
forEach is cleaner for simple iteration, but we cannot break or continue from it.

13. What’s the difference between array map and forEach?
forEach is used to loop through an array and does not return a new array.
map is used to transform each element and returns a new array.

14. What is the difference between array slice and splice?
Both slice() and splice() are used to work with arrays, but they behave differently.
slice() does not modify the original array.
It returns a new array containing the selected elements.

splice() modifies the original array.
It can remove, replace, or insert elements into the array.

15. What is an arguments object?
The arguments object is an array-like object available inside regular functions.
It contains all arguments passed to the function, even if the parameters are not explicitly defined.
It is not a real array, so array methods like map() or forEach() cannot be used directly.
Arrow functions do not have their own arguments object.
