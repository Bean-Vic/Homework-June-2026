# React Notes — First Person Concise Version

## 1. What is a SPA?
A **SPA**, or Single Page Application, is a web app that loads one HTML page and updates the page dynamically without full page reloads. I usually think of React apps as SPAs because React changes the UI based on state and routing.

## 2. What is JSX?
**JSX** is a JavaScript syntax extension that lets me write HTML-like code inside JavaScript.

```jsx
const element = <h1>Hello React</h1>;
```

JSX is not real HTML. It gets converted into JavaScript calls that create React elements.

## 3. What is Virtual DOM?
The **Virtual DOM** is React’s lightweight copy of the real DOM. When state or props change, React compares the new Virtual DOM with the old one, finds the difference, and updates only the necessary parts of the real DOM.

## 4. What does ReactDOM.render() do?
`ReactDOM.render()` mounts a React component into the real DOM.

```jsx
ReactDOM.render(<App />, document.getElementById("root"));
```

In React 18, this is legacy. The modern way is:

```jsx
createRoot(document.getElementById("root")).render(<App />);
```

## 5. What are props?
**Props** are inputs passed from a parent component to a child component. I use props to make components reusable.

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

Props are read-only. A child component should not mutate its props.

## 6. How do prop updates affect rendering?
When props change, React re-renders the child component with the new values. React then updates the DOM only where the output actually changed.

## 7. What is state? How do you update it? Can you mutate it directly?
**State** is data that belongs to a component and can change over time. When state changes, React re-renders the component.

In functional components, I update state with `useState`:

```jsx
const [count, setCount] = useState(0);
setCount(count + 1);
```

I should not mutate state directly because React may not detect the change.

Wrong:

```jsx
state.count = 1;
```

Right:

```jsx
setCount(count + 1);
```

## 8. Controlled vs uncontrolled component
A **controlled component** stores form value in React state.

```jsx
<input value={name} onChange={(e) => setName(e.target.value)} />
```

An **uncontrolled component** stores form value in the DOM, and I read it using a `ref`.

```jsx
const inputRef = useRef();
<input ref={inputRef} />
```

Controlled components are better for validation and predictable data flow. Uncontrolled components are simpler for quick forms.

## 9. React component lifecycle
The React lifecycle describes what happens when a component is created, updated, and removed.

Main phases:

1. **Mounting** — component appears on the screen.
2. **Updating** — props or state change.
3. **Unmounting** — component is removed.

## 10. Lifecycle methods
Common class component lifecycle methods:

| Method | Purpose |
|---|---|
| `constructor()` | Initialize state and bind methods |
| `render()` | Return JSX/UI |
| `componentDidMount()` | Run after first render, often for API calls |
| `componentDidUpdate()` | Run after updates |
| `componentWillUnmount()` | Cleanup timers, listeners, subscriptions |

In functional components, I usually use `useEffect()` instead.

```jsx
useEffect(() => {
  // run after render
  return () => {
    // cleanup
  };
}, []);
```

## 11. Execution order
For a class component mounting:

```text
constructor → render → componentDidMount
```

For updating:

```text
render → componentDidUpdate
```

For unmounting:

```text
componentWillUnmount
```

## 12. Use cases of lifecycle methods
I use lifecycle methods or `useEffect` for side effects, such as:

- fetching data
- setting timers
- adding event listeners
- cleaning up subscriptions
- updating the page title

## 13. What is React Strict Mode?
**React Strict Mode** is a development tool that helps find potential problems. It does not affect production behavior.

It can detect unsafe lifecycle methods, unexpected side effects, and deprecated patterns. In development, it may run some functions twice to expose bugs.

## 14. Synthetic events vs DOM events
React uses **Synthetic Events**, which are React’s wrapper around browser DOM events.

They work consistently across browsers and have a similar API to normal DOM events.

Example:

```jsx
<button onClick={handleClick}>Click</button>
```

A DOM event is the native browser event. A synthetic event is React’s normalized version of it.

## 15. Common React events
Common events I use:

- `onClick`
- `onChange`
- `onSubmit`
- `onKeyDown`
- `onMouseEnter`
- `onMouseLeave`
- `onFocus`
- `onBlur`

## 16. How does React handle errors?
React handles rendering errors with **Error Boundaries**. An Error Boundary catches errors in child components and shows fallback UI instead of crashing the whole app.

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

Error Boundaries catch render errors, lifecycle errors, and constructor errors in child components. They do not catch errors inside event handlers or async code. For those, I use `try...catch`.
