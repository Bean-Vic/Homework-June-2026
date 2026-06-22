## 1. What is the DOM?

In short, the DOM is the bridge between our HTML and JavaScript. When a browser parses a web page, it turns the static HTML code into a living tree structure of objects in memory, that’s the DOM. It essentially provides an API that lets JavaScript dynamically manipulate the page, whether that's updating content, tweaking CSS on the fly, or attaching event listeners.

## 2. How can you select an HTML element using JS?

We can select HTML elements using methods like getElementById, querySelector, and querySelectorAll.
For example, document.querySelector(".title") (document dot query selector dot title) selects the first element with the class title. If I need one element, I usually use querySelector. If I need multiple elements, I use querySelectorAll. So these methods help JavaScript find elements on the page.

## 3. What is a DOM event?

I think a DOM event is something that happens on a web page.
If a user clicks a button, types in an input box, scrolls the page, or submits a form. JavaScript can listen for these events and run code when they happen. So DOM events help us make the page interactive.

## 4. How do we register event handlers for a selected element?

We can register an event handler by using addEventListener.
If I select a button, I can use button.addEventListener("click", function() { ... }).(读法：button dot add event listener, click, function.）This means when the button is clicked, the function will run. addEventListener is a common way to handle user actions in JavaScript.

## 5. Explain event delegation. Why is it important?

Event delegation means we put one event listener on a parent element instead of adding listeners to many child elements. When a child is clicked, the event bubbles up to the parent, and the parent can handle it.
This is useful because it reduces the number of event listeners and also works for elements added later dynamically. So event delegation makes code cleaner and more efficient.

## 6. What is event propagation? How many phases are there? In what order does it occur?

Event propagation is the way an event travels through the DOM tree.
There are three phases: capturing phase, target phase, and bubbling phase.
First, the event goes down from the document to the target during capturing. Then it reaches the target element. After that, it bubbles back up to the parent elements. The order is capturing, target, then bubbling.

## 7. Explain event bubbling and event capturing.

Event capturing means the event moves from the outer parent elements down to the target element. Event bubbling means the event moves from the target element back up to the parent elements. By default, most event listeners use bubbling. If capturing goes down, and bubbling goes up.

## 8. What function prevents the bubbling behavior?

The function is stopPropagation().(读法：stop propagation method） It stops the event from continuing to bubble up to parent elements. If I click a button inside a div, and I call event.stopPropagation(), the div’s click handler will not be triggered by that click. stopPropagation() is used when I want to stop the event from moving upward.

## 9. What is an IIFE?

IIFE stands for Immediately Invoked Function Expression. It is a function that runs immediately after it is created. We can wrap a function in parentheses and call it right away.
It was often used to create a private scope and avoid polluting the global scope. An IIFE is basically a function that executes immediately.

## 10. What is the use of the preventDefault method?

preventDefault() stops the browser’s default behavior for an event. When clicking a link, the default behavior is to navigate to another page. If we call event.preventDefault(), it will stop that navigation.
It is also common in form submission when we want to handle the form with JavaScript first.
preventDefault() is used when we want to control the behavior ourselves.

## 11. Can you name some of the new ES6 features?

Some common ES6 features include let, const, arrow functions, template literals, default parameters, destructuring, spread syntax, classes, and promises.
Arrow functions make function syntax shorter, and template literals make string formatting easier.
I don’t need to use all of them every time, but they make JavaScript code cleaner and more modern. ES6 added many useful features for writing better JavaScript.
