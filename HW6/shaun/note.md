1. What is a SPA?
   A SPA (Single Page Application) loads a single HTML page and dynamically updates content without reloading the page.
2. What is JSX?
   JSX is a syntax extension for JavaScript that allows developers to write HTML-like code in React.
3. What is Virtual DOM?
   Virtual DOM is a lightweight copy of the real DOM that React uses to optimize UI updates.
4. What does `ReactDOM.render()` do?
   ReactDOM.render() renders a React component into a specified DOM element.
5. What are props?
   Props are read-only data passed from a parent component to a child component.
6. How do prop updates affect rendering?
   When props change, React automatically re-renders the component and its affected children.
7. What is a state, and how do you update it? Can you mutate it directly?
   State stores component data and should be updated using setState or useState, not mutated directly.
8. What is the difference between a `controlled` component and `uncontrolled` component?
   Controlled components store form data in React state, while uncontrolled components store it in the DOM.
9. Explain the React component lifecycle.
   React components go through three phases: mounting, updating, and unmounting.
10. List some lifecycle methods and explain what do they do
    Common lifecycle methods include componentDidMount, componentDidUpdate, and componentWillUnmount, which handle initialization, updates, and cleanup.
11. What is the execution order of constructor, render, and lifecycle methods?
    During mounting, the execution order is constructor → render → componentDidMount.
12. Describe the use case of lifecycle methods.
    Lifecycle methods are commonly used for data fetching, subscriptions, timers, and cleanup operations.
13. What is React strict mode?
    React Strict Mode is a development tool that helps identify unsafe lifecycle methods and potential issues in an application.
14. What are synthetic events and how are they different than DOM events?
    Synthetic events are React's cross-browser wrappers around native DOM events that provide a consistent API.
15. List some common events that you used most
    Common React events include onClick, onChange, onSubmit, onKeyDown, and onMouseOver.
16. How do React handle errors?
    React handles rendering errors using Error Boundaries, which catch errors in child components and display fallback UI.
