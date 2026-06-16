# Interview Questions on DOM and JavaScript

## 1. What is the DOM?

 DOM stands for Document Object Model. It is an interface that represents the structure of an HTML page as a tree of objects, allowing JavaScript to read, and to manipulate the page dynamically.

## 2. How can you select an HTML element using JavaScript?

 I use the `querySelector()` or `querySelectorAll()` method. They can select elements by id, class or tag or using the hierarchy. They use the same syntax as in CSS.

 Sometimes I also go with methods like `getElementById()` or `getElementsByName()`.

## 3. What is a DOM event?

 A DOM event is a signal that a specific action has occurred on a webpage, allowing JavaScript to react to it. Events can be triggered by users, like a click, or by the browsers.

## 4. How do we register event handlers for a selected element?

 We can use the `addEventListener` method to attach event handlers to an element, specifying the event and the callback function.

 Or we can directly modify the element's properties, for example the `onclick` properity, and assign a function to it. We can even add event handlers directly inside the HTML tags, but it's not recommended.

## 5. Explain Event Delegation. Why is it important?

 Event Delegation is a design pattern for attaching Event Listeners. Instead of adding an Event Listener to each one of the child elements, we can, instead, assign one Event Listener to their common parent. So during the event Bubbling, the listener can catch the event.

 It is important because it enhances the performance drastically. If there is a list with 1,000 items, attaching one thousand listeners will consume a massive amount of memory. Delegating to the parent requires only one listener in memory.

 It is also necessary in case of dynamic elements. If we are injecting a new element into the DOM, we don't need to manually bind a new listener for it. With Event Delegation, its parent can listen to its event.

## 6. What is Event Propagation? How many phases are there? In what order does it occur?

 Event Propagation is the mechanism the browser uses to determine the order in which DOM elements receive and process an event, when they are nested in the DOM tree.

 It has three phases, the Capturing Phase, the Target Phase and the Bubbling Phase.

 Actually, at the moment the event happens, a process called Hit Testing will create an array that represents the path to the element, and the browser will create an Event Object. So the three phases are, essentially, the order in which the browser passes the Event Object through the array.

 It starts with the Capturing Phase, which is top-down. The browser iterates forward through the path array, starting from the `Window`, traveling down, with the Event Object. As it reaches the `target` element, the event listeners attached directly to this target element will be executed. And this is the Target Phase.
 Then the browser turns around and iterates backward through the path array, from the target back up to the `Window`. This is the Bubbling Phase. It notifies all ancestors of the `target` that an event has occurred inside.

## 7. Explain Event Capturing and Event Bubbling

 Event Capturing is the process that the browser iterates forward through the path array, with the Event Object, to reach the target element. It starts from the `Window` and it is top-down.

 Event Bubbling is the phase that the browser turns around and iterates backward through the path array, still with the Event Object, traveling from the `target` back up to the `Window`. It notifies all ancestors of the `target` that an event has finished happening inside them.

## 8. What function prevents the bubbling behavior?

 `stopPropagation();`, it is a method belongs to the event object.

## 9. What is an IIFE?

 IIFE stands for Immediately Invoked Function Expression. It is a function defined as an expression and executed immediately after creation, and once it finishes running, its internal variables are destroyed.

## 10. What is the use of the `preventDefault` method?

 The `preventDefault` method disables the element's default HTML behavior on an event.

 For example, when you click a link, by default, the browser navigates you to the specified URL. However, if we have `event.preventDefault()` in the event handler, the anchor element will be disabled from opening the link.

## 11. Can you name some of the new ES6 features?

 Arrow Functions, that's the first thing comes to my mind. `let` and `const`; spread operator; Promises, `import` and `export`; Template literal; and destructuring assignment.
