# HW6 Notes

## 1. What is a SPA?

A SPA, or Single Page Application, is a web app that loads one main HTML page first, then uses JavaScript to update the content without refreshing the whole page.

It is useful for interactive apps because page changes feel faster and smoother, more like a mobile app.

## 2. What is JSX?

JSX is a syntax extension for JavaScript. It lets us write HTML-like UI code inside JavaScript.

Normally, I use JSX because it makes UI easier to read and write. We can also use JavaScript values inside JSX with curly braces, like `{name}`. Behind the scenes, JSX is converted into normal JavaScript.

## 3. What is Virtual DOM?

Virtual DOM is a JavaScript copy of the real DOM.

React updates the Virtual DOM first, compares the old version and the new version, then only updates the real DOM parts that actually changed.

## 4. What does `ReactDOM.render()` do?

`ReactDOM.render()` renders a React component into the real DOM.

In older React versions, we use it to mount the root component, usually `App`, into an HTML element like `root`.

## 5. What are props?

Props are data passed from a parent component to a child component.

They are read-only inside the child component, so the child should not directly change its props.

## 6. How do prop updates affect rendering?

When props change, React re-renders the component that receives those props.

Then React checks what changed in the UI and updates the DOM if needed.

## 7. What is a state, and how do you update it? Can you mutate it directly?

State is data that belongs to a component and can change over time.

In class components, we update state with `setState()`. In function components, we usually use a setter from `useState()`.

We should not mutate state directly, because React may not know it changed. Instead, we create a new value and update state with the setter.

## 8. What is the difference between a `controlled` component and `uncontrolled` component?

A controlled component is controlled by React state. For example, an input value comes from state, and `onChange` updates that state.

An uncontrolled component keeps its own value in the DOM. We usually read its value with a ref when needed.

## 9. Explain the React component lifecycle.

The React component lifecycle means the stages a component goes through: mounting, updating, and unmounting.

Mounting means the component is created and shown on the page. Updating means props or state changed, so the component re-renders. Unmounting means the component is removed from the page.

React component lifecycle allows us to run code at the right time, like fetching data after the component mounts, responding to prop or state changes, and cleaning up timers before the component unmounts.

## 10. List some lifecycle methods and explain what do they do

`constructor()` runs first and is usually used to initialize state.

`render()` returns the UI.

`componentDidMount()` runs after the component appears on the page. It is good for API calls or setup.

`componentDidUpdate()` runs after props or state updates.

`componentWillUnmount()` runs before the component is removed. It is good for cleanup, like clearing timers.

## 11. What is the execution order of constructor, render, and lifecycle methods?

When a class component mounts, the order is:

`constructor()` -> `render()` -> `componentDidMount()`

When it updates, the common order is:

`render()` -> `componentDidUpdate()`

When it unmounts, React calls:

`componentWillUnmount()`

## 12. Describe the use case of lifecycle methods.

We use lifecycle methods when we need to run code at a specific stage of a component.

For example, `componentDidMount()` is used after the component appears on the page, so it is good for fetching data or setting up a timer.

`componentDidUpdate()` is used after props or state changes, so it is good for responding to updates, like fetching new data when a prop changes.

`componentWillUnmount()` is used before the component is removed, so it is good for cleanup, like clearing timers or removing event listeners.

## 13. What is React strict mode?

React Strict Mode is a development tool that helps find potential problems in the app.

It does not affect production. In development, it may run some code twice to help catch side effects.

## 14. What are synthetic events and how are they different than DOM events?

Synthetic events are React's wrapper around browser DOM events.

They work almost the same as normal events, but React makes them more consistent across different browsers.

## 15. List some common events that you used most

Some common React events are `onClick`, `onChange`, `onSubmit`, `onMouseEnter`, `onMouseLeave`, `onKeyDown`, and `onFocus`.

I use `onClick` for buttons, `onChange` for inputs, and `onSubmit` for forms most often.

## 16. How do React handle errors?

React can handle rendering errors with Error Boundaries.

An Error Boundary is usually a class component. It uses `getDerivedStateFromError()` to update state and show a fallback UI, and uses `componentDidCatch()` to catch and log the error, for example sending it to a server.

Error Boundaries catch errors during React rendering, such as errors in child components, constructors, render methods, and lifecycle methods.

They do not catch errors in event handlers, async code, or `setTimeout`, because those errors happen outside the render lifecycle. For those cases, we usually use normal `try...catch`.
