


1. What is the DOM?
The DOM means Document Object Model.

```
<body>
  <h1>Hello</h1>
  <button>Click me</button>
</body>

document
└── html
    └── body
        ├── h1
        └── button
```

2. How can you select an HTML element using JS?

You select HTML elements with methods on document.

```
document.querySelector("p");          // first <p>
document.querySelector(".card");      // first element with class="card"
document.querySelector("#submitBtn"); // element with id="submitBtn"
```

3. What is a DOM event?

A DOM event is something that happens on a webpage that JavaScript can respond to.

```
click
submit
keydown
mouseover
input
load

const button = document.querySelector("button");

button.addEventListener("click", function () {
  console.log("Button clicked!");
});
```

4. How do we register event handlers for a selected element?

You register an event handler using addEventListener().

```
const button = document.querySelector("button");

button.addEventListener("click", function () {
  console.log("Button clicked!");
});
```

5. Explain event delegation. Why is it important?

Event delegation is a pattern where we attach one event listener to a parent element and use event.target to determine which child triggered the event. It is important because it reduces the number of event listeners and also handles dynamically added child elements.

```
<ul id="todoList">
  <li>Buy food</li>
  <li>Study JS</li>
  <li>Sleep</li>
</ul>

// old
document.querySelectorAll("li").forEach((item) => {
  item.addEventListener("click", () => {
    console.log("Clicked item");
  });
});

// new
const list = document.querySelector("#todoList");
list.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    console.log("Clicked:", event.target.textContent);
  }
});
```

6. What is event propagation? How many phases are there? In what order does it occur?

Event propagation is how an event travels through the DOM tree when something happens.

There are 3 phases:
```
1. Capturing phase
   document → html → body → div → button
2. Target phase
   button
3. Bubbling phase
   button → div → body → html → document
```

Default behavior is usually bubbling.

7. Explain event bubbling and event capturing.

Event bubbling and event capturing are two directions that a DOM event can travel.

Event capturing
Capturing happens from the outside/root down to the target.
document → html → body → parent → child

Event bubbling
Bubbling happens from the target back up to the root.
child → parent → body → html → document

8. What function prevents the bubbling behavior?

Use:
event.stopPropagation();

```
const parent = document.querySelector("#parent");
const child = document.querySelector("#child");

parent.addEventListener("click", () => {
  console.log("parent clicked");
});

child.addEventListener("click", (event) => {
  event.stopPropagation();
  console.log("child clicked");
});
```

9. What is an IIFE?

An IIFE means Immediately Invoked Function Expression.
It is a function that is created and executed immediately.

```
(function () {
  // function body
})();
```
The first () turns the function into an expression.
The second () immediately calls it.

10. What is the use of the `preventDefault` method?

event.preventDefault() stops the browser’s default behavior for an event.

Form submit
By default, submitting a form refreshes/navigates the page.
```
const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  console.log("Form submitted without page refresh");
});
```

Link click
By default, clicking a link navigates to another page.
```
const link = document.querySelector("a");

link.addEventListener("click", (event) => {
  event.preventDefault();

  console.log("Link navigation stopped");
});
```

11. Can you name some of the new ES6 features?
// investigate later.

let
const
arrow functions
template literals
default parameters
destructuring
spread / rest operator
classes
modules
promises
Map and Set