# HW4 Q & A

## 1. What is the DOM?

DOM stands for Document Object Model.

It is the browser's object representation of an HTML page. JavaScript can use the DOM to read, change, add, or remove elements on the page.

## 2. How can you select an HTML element using JS?

We can use methods like `document.querySelector`, `document.querySelectorAll`, `document.getElementById`, and `document.getElementsByClassName`.

For example, `document.querySelector(".title")` selects the first element with class `title`.

## 3. What is a DOM event?

A DOM event is something that happens on the page, like a click, key press, form submit, mouse move, or page load.

JavaScript can listen to these events and run code when they happen.

## 4. How do we register event handlers for a selected element?

We usually use `addEventListener`.

```js
button.addEventListener("click", () => {
  console.log("Button clicked");
});
```

## 5. Explain event delegation. Why is it important?

Event delegation means we put one event listener on a parent element and handle events from its child elements.

It is useful because we do not need to add many listeners. It also works well when child elements are added dynamically later.

## 6. What is event propagation? How many phases are there? In what order does it occur?

Event propagation is the process of an event traveling through the DOM tree after it happens.

There are three phases: capturing phase, target phase, and bubbling phase.

The order is capturing first, then the target phase, then bubbling. During capturing, the event travels from ancestors down to the target. During bubbling, it travels from the target back up to ancestors.

## 7. Explain event bubbling and event capturing.

Event capturing means the event travels from outer parent elements down to the target element.

Event bubbling means the event travels from the target element back up to its parent elements.

By default, most event listeners run during the bubbling phase.

## 8. What function prevents the bubbling behavior?

`event.stopPropagation()` prevents the event from bubbling up to parent elements.

We use it when a child element has its own event behavior, and we do not want it to trigger the parent's event handler.

## 9. What is an IIFE?

IIFE stands for Immediately Invoked Function Expression.

It is a function that runs immediately after it is created.

It was often used to create a private scope and avoid polluting the global scope, especially before `let` and `const`.

Now we use it less because `let`, `const`, and modules already help with scope.

```js
(function () {
  console.log("Run immediately");
})();
```

## 10. What is the use of the `preventDefault` method?

`event.preventDefault()` stops the browser's default behavior, like a link opening a URL or a form submitting and refreshing the page.

We use it when we want JavaScript to control what happens instead.

## 11. Can you name some of the new ES6 features?

Some ES6 features are `let`, `const`, arrow functions, template literals, destructuring, default parameters, classes, modules, promises, and spread/rest syntax.
