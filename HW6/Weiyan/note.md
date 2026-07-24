# HW6 React

## 1. What is an SPA?

 SPA, or Single Page Application, is a web application where the server sends only one single HTML file to the browser. It dynamically rewrites the current web page with different components, instead of loading new HTML pages.

## 2. What is JSX?

 JSX stands for JavaScript XML. It is a syntax extension that allows us to write HTML directly inside JavaScript.

## 3. What is Virtual DOM?

 The Virtual DOM is the in-memory representation of the actual Real DOM, but it is lightweight. It is used in React to reflect our changes to the DOM more efficiently.

## 4. What does `ReactDOM.render()` do?

 `ReactDOM.render()` is written in the entry file; it is used to mount the React application onto the root HTML element, to officially hand over control of that container to React.

## 5. What are props?

 Props, or properties, are arguments passed in to create an instance of a component. They are passed from a parent component to a child component, and they are read-only.

## 6. How do prop updates affect rendering?

 Whenever a component's prop is updated, the component will be re-rendered.

 (Actually, because props are passed down from a parent, a prop's update is actually the result of a state's update from a parent component. It is a parent's state variable that gets updated, and this state is used as props for its child so that the prop of the child gets updated and triggers a re-render.)

## 7. What is a state, and how do you update it? Can you mutate it directly?

 A state, essentially, is a local variable that lives inside a component.

- For a Functional Component, we create a `set` function when declaring the state, and then always use this `set` function for updating the state.
- For Class Components, we update a state using `this.setState` method.

 We can't mutate it directly.

## 8. What is the difference between a controlled component and an uncontrolled component?

- A controlled component delegates its state management entirely to its parent, via the props of `value` and `onChange`. It provids a "single source of truth", which ensures the UI and the underlying data are always in sync.

- An uncontrolled component manages its own internal state natively, where the parent can only read the data on demand using a `ref`.

## 9. Explain the React component lifecycle

 There are three phases in a component's lifecycle:

- It starts with Mounting. Mounting is the first time when a component is inserted into the DOM.
- Then there will be Updating. It means the component gets re-rendered whenever its props or state changes.
- Finally there is Unmounting, which means React removes this component completely from the DOM.

## 10. List some lifecycle methods and explain what do they do

 There are `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` for Mount, Update and Unmount, respectively. They are used to execute side effects and clean up side effects eventually.

## 11. What is the execution order of constructor, render, and lifecycle methods?

- During the mounting, it starts with the constructor, then render, then `componentDidMount`.
- During an update, it calls render again, followed by `componentDidUpdate`.
- Finally, before the component is destroyed, it calls `componentWillUnmount`.

## 12. Describe the use case of lifecycle methods

- In most cases, we use `componentDidMount` to make the initial API call to fetch data right after a page loads.
- We use `componentDidUpdate` to check if the props or state has changed, and then perform a new fetch.
- Finally, we can use `componentWillUnmount` to, for example, close the live WebSocket connection, or to clear the `setInterval` timer.

## 13. What is React strict mode?

 React Strict Mode is a diagnostic tool used in development that it double-invokes components and `useEffect` hooks so it becomes visible if the component modifies a global variable or we forget to write cleanup for `useEffect` hooks.

## 14. What are Synthetic Events and how are they different than DOM events?

 A Synthetic Event is a wrapped DOM event, (wrapped by React,) with the purpose to abstract away the need for writing Event Delegation manually. (Because) In plain JavaScript, we have to manually set up event delegation, but in React,with Synthetic Events, we can simply attach event handlers directly to individual elements and React will perform Event Delegation at the root level.

## 15. List some common events that you used most

 There are...

- Mouse events, like `onClick`, `onDoubleClick`, `onMouseEnter`, `onMouseLeave`.
- Keyboard events, `onKeyDown`, `onKeyUp`.
- Form events, like `onChange`, `onSubmit`, `onFocus` and `onBlur`.
- UI events, like `onScroll`.

## 16. How do React handle errors?

 React handles rendering errors using Error Boundaries. An Error Boundary is a class component that catches errors of all its child components during rendering; it logs those errors, and displays a fallback UI.

 Error Boundaries only catch rendering errors. To catch errors in event handlers or async code, we still need `try/catch` blocks.
