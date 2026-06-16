1. What is the DOM?
The DOM stands for Document Object Model. It's a tree-like representation of the HTML page that the browser builds, where each element, attribute, and text node becomes an object. JavaScript uses this tree to read and manipulate the page dynamically.

2. How can you select an HTML element using JS?
The most common way is document.querySelector for a single element, or querySelectorAll for multiple — both take CSS selectors. There are also older methods like getElementById, getElementsByClassName, and getElementsByTagName. In modern code, we mostly stick with querySelector.

3. What is a DOM event?
A DOM event is a signal the browser fires when something happens — a click, a keypress, the page loading, a form submit, you name it. We can listen for these events and run code in response. It's basically how we make pages interactive.

4. How do we register event handlers for a selected element?
The standard way is addEventListener — we pass it the event name and a callback, like el.addEventListener('click', handler). The advantage over inline onclick is that we can attach multiple listeners to the same element, and we can remove them later with removeEventListener.

5. Explain event delegation. Why is it important?
Event delegation means attaching one listener to a parent element instead of many listeners on each child, and using event.target to figure out which child was clicked. It's important because it improves performance and it automatically handles dynamically added children — we don't need to re-bind every time.

6. What is event propagation? How many phases are there? In what order does it occur?
Event propagation is how an event travels through the DOM tree. There are three phases: capturing — from the root down to the target; target — at the element itself; and bubbling — back up to the root. By default, listeners fire in the bubbling phase unless we pass true as the third argument.

7. Explain event bubbling and event capturing.
Bubbling is when the event starts at the target and bubbles up through its ancestors — this is the default. Capturing is the opposite — the event travels from the root down to the target. We can opt into capturing by passing { capture: true } to addEventListener. Bubbling is what makes event delegation work.

8. What function prevents the bubbling behavior?
event.stopPropagation(). We call it inside the handler, and the event won't travel up to parent elements anymore. There's also stopImmediatePropagation, which additionally stops other listeners on the same element from firing.

9. What is an IIFE?
IIFE stands for Immediately Invoked Function Expression. It's a function that runs the moment we define it, wrapped in parentheses like (function(){ ... })(). Back in the pre-ES6 days, we used it to create private scope and avoid polluting the global namespace. With block-scoped let and const and ES modules now, we rarely need it.

10. What is the use of the `preventDefault` method?
preventDefault stops the browser's default behavior for an event. For example, on a form submit it prevents the page reload, or on an anchor click it stops navigation. It's different from stopPropagation — preventDefault cancels the default action, while stopPropagation controls how the event travels.

11. Can you name some of the new ES6 features?
Sure — let and const, arrow functions, template literals, destructuring, default parameters, the spread and rest operators, classes, modules with import and export, promises, and the Map and Set data structures. ES6 was a huge update — most modern JavaScript syntax comes from it.
