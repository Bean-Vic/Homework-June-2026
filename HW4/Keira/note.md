# JavaScript DOM, Events, and ES6 Notes

## 1. What is the DOM?

**DOM** stands for **Document Object Model**.

The DOM is a programming interface that represents an HTML document as a tree of objects.

For example, this HTML:

```html
<body>
  <h1>Hello</h1>
  <button>Click me</button>
</body>
```

becomes a tree-like structure:

```text
document
└── html
    └── body
        ├── h1
        └── button
```

JavaScript can use the DOM to:

- read HTML elements
- change text or styles
- add or remove elements
- respond to user actions like clicks, typing, scrolling, etc.

Example:

```js
document.querySelector("h1").textContent = "New title";
```

---

## 2. How can you select an HTML element using JS?

Common ways to select HTML elements:

### Select by ID

```js
const title = document.getElementById("title");
```

### Select by class

```js
const item = document.querySelector(".item");
```

### Select by tag

```js
const button = document.querySelector("button");
```

### Select multiple elements

```js
const allItems = document.querySelectorAll(".item");
```

`querySelector` returns the **first matching element**.

`querySelectorAll` returns a **NodeList** of all matching elements.

---

## 3. What is a DOM event?

A **DOM event** is something that happens in the browser.

Examples:

- user clicks a button
- user types in an input
- page finishes loading
- mouse moves
- form is submitted
- user scrolls

Example event names:

```js
click
input
submit
keydown
mouseover
DOMContentLoaded
```

---

## 4. How do we register event handlers for a selected element?

An **event handler** is a function that runs when an event happens.

The modern way is to use `addEventListener`.

```js
const button = document.querySelector("button");

button.addEventListener("click", function () {
  console.log("Button clicked");
});
```

Using an arrow function:

```js
button.addEventListener("click", () => {
  console.log("Button clicked");
});
```

You can also receive the event object:

```js
button.addEventListener("click", (event) => {
  console.log(event.target);
});
```

---

## 5. Explain event delegation. Why is it important?

**Event delegation** means adding one event listener to a parent element instead of adding separate listeners to many child elements.

Example:

```html
<ul id="list">
  <li>Apple</li>
  <li>Banana</li>
  <li>Orange</li>
</ul>
```

Instead of adding a click listener to every `li`, add one listener to the `ul`:

```js
const list = document.querySelector("#list");

list.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    console.log("Clicked:", event.target.textContent);
  }
});
```

### Why it is important

Event delegation is useful because:

- it uses fewer event listeners
- it improves performance
- it works for elements added later dynamically
- it keeps code cleaner

For example, if a new `li` is added later, the parent `ul` listener can still handle clicks on it.

---

## 6. What is event propagation? How many phases are there? In what order does it occur?

**Event propagation** describes how an event travels through the DOM tree.

There are **3 phases**:

1. **Capturing phase**
2. **Target phase**
3. **Bubbling phase**

Order:

```text
Capturing phase: document -> parent -> target
Target phase: event reaches the actual target element
Bubbling phase: target -> parent -> document
```

Example:

```html
<div id="parent">
  <button id="child">Click</button>
</div>
```

When the button is clicked, the event can travel:

```text
document
  ↓
div#parent
  ↓
button#child
  ↑
div#parent
  ↑
document
```

---

## 7. Explain event bubbling and event capturing.

### Event bubbling

**Bubbling** means the event starts at the target element and moves upward to its ancestors.

```text
button -> div -> body -> html -> document
```

By default, most event listeners listen during the bubbling phase.

```js
parent.addEventListener("click", () => {
  console.log("Parent clicked");
});
```

### Event capturing

**Capturing** means the event starts from the top of the DOM tree and moves downward to the target element.

```text
document -> html -> body -> div -> button
```

To listen during the capturing phase, pass `true` or `{ capture: true }` as the third argument:

```js
parent.addEventListener(
  "click",
  () => {
    console.log("Parent clicked during capturing");
  },
  true
);
```

Or:

```js
parent.addEventListener(
  "click",
  () => {
    console.log("Parent clicked during capturing");
  },
  { capture: true }
);
```

---

## 8. What function prevents the bubbling behavior?

Use:

```js
event.stopPropagation();
```

Example:

```js
child.addEventListener("click", (event) => {
  event.stopPropagation();
  console.log("Child clicked");
});
```

This prevents the event from continuing to bubble up to parent elements.

---

## 9. What is an IIFE?

**IIFE** stands for **Immediately Invoked Function Expression**.

It is a function that runs immediately after it is created.

Classic syntax:

```js
(function () {
  console.log("I run immediately");
})();
```

Arrow function syntax:

```js
(() => {
  console.log("I also run immediately");
})();
```

### Why use an IIFE?

IIFEs are used to:

- create a private scope
- avoid polluting the global scope
- run setup code immediately

Example:

```js
(function () {
  const secret = "hidden";
  console.log(secret);
})();

console.log(secret); // Error: secret is not defined
```

---

## 10. What is the use of the preventDefault method?

`preventDefault()` prevents the browser's default behavior for an event.

Example: prevent a form from refreshing the page.

```js
const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("Form submitted without page refresh");
});
```

Other examples:

- stop a link from navigating
- stop a checkbox from checking
- stop form submission reload
- stop drag/drop default behavior

Example with a link:

```js
const link = document.querySelector("a");

link.addEventListener("click", (event) => {
  event.preventDefault();
  console.log("Navigation stopped");
});
```

---

## 11. Can you name some of the new ES6 features?

ES6, also called ECMAScript 2015, introduced many important JavaScript features.

Common ES6 features:

### `let` and `const`

```js
let age = 30;
const name = "Keira";
```

### Arrow functions

```js
const add = (a, b) => a + b;
```

### Template literals

```js
const message = `Hello, ${name}`;
```

### Default parameters

```js
function greet(name = "Guest") {
  return `Hello, ${name}`;
}
```

### Destructuring

```js
const user = { username: "Tom", age: 25 };

const { username, age } = user;
```

### Spread operator

```js
const nums = [1, 2, 3];
const copy = [...nums];
```

### Rest parameters

```js
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}
```

### Classes

```js
class Person {
  constructor(name) {
    this.name = name;
  }

  sayHi() {
    console.log(`Hi, I am ${this.name}`);
  }
}
```

### Modules

```js
export function add(a, b) {
  return a + b;
}

import { add } from "./math.js";
```

### Promises

```js
const promise = new Promise((resolve, reject) => {
  resolve("Done");
});
```

---

# Quick Interview Summary

## DOM

The DOM is a tree-like representation of an HTML document. JavaScript uses it to read and manipulate web page content.

## Selecting elements

Use methods like:

```js
document.getElementById("id");
document.querySelector(".class");
document.querySelectorAll("div");
```

## Events

A DOM event is an action that happens in the browser, such as click, input, submit, or keydown.

## Event handlers

Use `addEventListener`:

```js
element.addEventListener("click", handlerFunction);
```

## Event delegation

Event delegation puts one listener on a parent element to handle events from child elements. It is useful for performance and dynamic elements.

## Event propagation

Event propagation has 3 phases:

1. Capturing
2. Target
3. Bubbling

## Stop bubbling

Use:

```js
event.stopPropagation();
```

## Prevent default browser behavior

Use:

```js
event.preventDefault();
```

## IIFE

An IIFE is a function that runs immediately after it is defined.

```js
(function () {
  console.log("Run now");
})();
```

## ES6 features

Important ES6 features include:

- `let`
- `const`
- arrow functions
- template literals
- destructuring
- spread/rest
- classes
- modules
- promises
