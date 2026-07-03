
```
# F
review these for expanded sol later.
```

1. What is a SPA?

A **SPA, or Single Page Application**, is a web application that loads one main HTML page and then uses JavaScript to update the UI dynamically as the user navigates, instead of doing a full page reload for every route. For example, in a React app, clicking from `/home` to `/dashboard` may just swap components on the client side while the browser stays on the same loaded page. This makes the app feel faster and more interactive, but it also adds complexity around routing, state management, initial bundle size, and sometimes SEO, unless server-side rendering or pre-rendering is used.

2. What is JSX?

JSX is a JavaScript syntax extension used commonly with React that lets you write UI markup that looks like HTML directly inside JavaScript. It is not actual HTML; tools like Babel or a framework compiler transform JSX into regular JavaScript function calls that create React elements. For example, <h1>Hello</h1> becomes something like React.createElement("h1", null, "Hello"). The benefit is that it makes component UI easier to read and keep close to the logic, while still allowing JavaScript expressions inside the markup using curly braces, like {user.name}.

3. What is Virtual DOM?

The Virtual DOM is a lightweight JavaScript representation of the real browser DOM used by libraries like React. When state or props change, React creates a new Virtual DOM tree, compares it with the previous one using a process called diffing, and then updates only the parts of the real DOM that actually changed. This helps avoid unnecessary direct DOM manipulation, which can be slower and harder to manage manually. In interviews, I would say the Virtual DOM makes UI updates more efficient and predictable by letting React calculate the minimal changes needed before touching the real DOM.

4. What does `ReactDOM.render()` do?

ReactDOM.render() is the older React API used to mount a React component tree into a real DOM element on the page. For example, it takes something like <App /> and renders it inside a container such as document.getElementById("root"), connecting React’s component system to the browser DOM. In React 18+, ReactDOM.render() is considered legacy and is replaced by createRoot(...).render(...), but conceptually it does the same main job: it starts the React app by attaching the root component to a DOM node.

5. What are props?

Props are inputs passed from a parent component to a child component in React. They let components be reusable and configurable, similar to function parameters. For example, a parent can render <UserCard name="Alice" age={25} />, and the UserCard component can read those values through props.name and props.age. Props are read-only from the child’s perspective, so the child should not directly modify them; if data needs to change, the parent usually owns the state and passes updated props down.

6. How do prop updates affect rendering?

When a component receives new props, React schedules that component to re-render so its UI can reflect the new input. During re-render, React calls the component again, creates a new Virtual DOM representation, compares it with the previous one, and updates the real DOM only where something actually changed. Prop changes can also cause child components to re-render because the parent passes new values down. In interviews, I would say props are read-only inputs, and whenever those inputs change, React re-evaluates the component’s output to keep the UI in sync with the latest data.

7. What is a state, and how do you update it? Can you mutate it directly?

**State** is data that belongs to a component and can change over time, causing the UI to re-render when it updates. In React, with function components, we usually create state using `useState`, like `const [count, setCount] = useState(0)`, and update it by calling the setter, such as `setCount(count + 1)`. You should **not mutate state directly**, like `count = count + 1` or `items.push(newItem)`, because React may not detect the change correctly and the UI may not update. Instead, create a new value or new object/array, like `setItems([...items, newItem])`, so React can safely re-render with the updated state.

8. What is the difference between a `controlled` component and `uncontrolled` component?

A **controlled component** is a form element whose value is managed by React state, so the input value comes from state and changes through an event handler like `onChange`. For example, an input with `value={name}` and `onChange={e => setName(e.target.value)}` is controlled because React is the source of truth. An **uncontrolled component** keeps its own value inside the DOM, and React reads it only when needed, often using a `ref`. In interviews, I would say controlled components give you more control for validation, conditional UI, and instant state updates, while uncontrolled components are simpler when you just need to read the value on submit.

9. Explain the React component lifecycle.

The React component lifecycle describes the stages a component goes through: mounting, updating, and unmounting. Mounting happens when the component is first created and added to the DOM. Updating happens when its props or state change and React re-renders it. Unmounting happens when the component is removed from the DOM. In modern function components, we usually handle lifecycle behavior with useEffect: an effect can run after render, re-run when dependencies change, and return a cleanup function for unmounting, such as removing event listeners or canceling timers.

10. List some lifecycle methods and explain what do they do.

Common class component lifecycle methods are componentDidMount, componentDidUpdate, and componentWillUnmount. componentDidMount() runs after the component is first rendered to the DOM, so it is often used for API calls, subscriptions, or setup work. componentDidUpdate(prevProps, prevState) runs after props or state change, so it is used to respond to updates, like refetching data when an ID prop changes. componentWillUnmount() runs right before the component is removed from the DOM, so it is used for cleanup, like removing event listeners, clearing timers, or canceling subscriptions. In modern React function components, these are usually handled with useEffect.

11. What is the execution order of constructor, render, and lifecycle methods?

In a class component, the normal mounting order is: constructor first, then render, then componentDidMount. The constructor initializes state and binds methods, render() returns the UI, and componentDidMount() runs after the component is placed in the DOM. When the component updates, the order is usually render, then componentDidUpdate. When it is removed, componentWillUnmount runs right before React removes it from the DOM.

12. Describe the use case of lifecycle methods.

Lifecycle methods are used to run code at specific points in a component’s life: when it is created, updated, or removed. For example, componentDidMount is commonly used to fetch data from an API, start a timer, or subscribe to an event after the component appears on the page. componentDidUpdate is used when you need to respond to prop or state changes, such as refetching data when a user ID changes. componentWillUnmount is used for cleanup, like clearing timers, removing event listeners, or unsubscribing from WebSocket updates. In modern React, these same use cases are usually handled with useEffect and its cleanup function.

13. What is React strict mode?

React Strict Mode is a development-only tool that helps find potential problems in a React app. You wrap part of the app with <React.StrictMode>, and React will add extra checks and warnings for things like unsafe lifecycle methods, deprecated APIs, unexpected side effects, and components that are not safe for future React features. In React 18 development mode, it may intentionally render components or run effects twice to help reveal bugs caused by impure rendering or missing cleanup. It does not affect the production build; it is mainly used to catch issues early while developing.

14. What are synthetic events and how are they different than DOM events?

**Synthetic events** are React’s wrapper around native browser DOM events. They give events like `onClick`, `onChange`, and `onSubmit` a consistent API across different browsers. For example, in React you write `onClick={handleClick}` instead of `onclick="..."`, and the handler receives a React synthetic event object. The main difference is that native DOM events come directly from the browser, while synthetic events are normalized and managed by React’s event system, but they still provide access to the original browser event through `event.nativeEvent`.

15. List some common events that you used most.

Some common React events I use most are `onClick` for button clicks, `onChange` for form inputs, `onSubmit` for form submission, `onKeyDown` for keyboard actions, `onMouseEnter` and `onMouseLeave` for hover behavior, and `onFocus` / `onBlur` for input focus handling. For example, in a form-heavy React app, I would usually use `onChange` to keep input state updated, `onSubmit` to handle the final form data, and `onClick` for actions like opening modals or triggering API calls.

16. How do React handle errors?

React handles rendering errors mainly through **Error Boundaries**. An error boundary is a special component that catches JavaScript errors in its child component tree, prevents the whole app from crashing, and shows a fallback UI instead. In class components, you create one using `static getDerivedStateFromError()` to update fallback state and `componentDidCatch()` to log the error. Error boundaries catch errors during rendering, lifecycle methods, and constructors, but they do **not** catch errors in event handlers, async code, or server-side code. For those, we usually use normal `try/catch`, `.catch()`, or error handling around API calls.
