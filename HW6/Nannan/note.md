1. What is a SPA?
SPA stands for Single Page Application. The browser loads one HTML page, and JavaScript dynamically swaps the content as we navigate, so the page doesn't do full reloads. It feels snappier and more app-like — React, Vue, and Angular are typical SPA frameworks.

2. What is JSX?
JSX is a syntax extension that lets us write HTML-like code inside JavaScript. It's not actually understood by the browser — Babel compiles it down to React.createElement calls. So <div>Hi</div> becomes a function call that returns a React element object.

3. What is Virtual DOM?
The Virtual DOM is a lightweight JavaScript representation of the real DOM. When state changes, React builds a new virtual tree, diffs it against the previous one, and only updates the parts of the real DOM that actually changed. This is much faster than re-rendering the whole page.

4. What does `ReactDOM.render()` do?
`ReactDOM.render()` mounts a React component into a real DOM node — typically the root div in our HTML. In React 18, it was replaced by ReactDOM.createRoot().render(), which enables the new concurrent rendering features.

5. What are props?
Props are how we pass data from a parent component down to a child. They're read-only — the child shouldn't mutate them. Think of them like function arguments: same input, same output, which is what makes components predictable.

6. How do prop updates affect rendering?
When a parent re-renders, its children receive new props and re-render by default. React then diffs the virtual DOM and updates only what changed. We can optimize this with React.memo or useMemo when re-renders get expensive.

7. What is a state, and how do you update it? Can you mutate it directly?
State is data a component manages internally that can change over time. In hooks, we use useState and call the setter — like setCount(count + 1) — to update it. We can't mutate it directly, because React relies on reference changes to detect updates and trigger re-renders.

8. What is the difference between a `controlled` component and `uncontrolled` component?
In a controlled component, React state is the source of truth — the input's value comes from state, and we update it via onChange. In an uncontrolled component, the DOM holds the value, and we read it with a ref when we need it. Controlled is the standard for forms in React.

9. Explain the React component lifecycle.
A component goes through three phases: mounting — when it's first added to the DOM; updating — when props or state change; and unmounting — when it's removed. In class components we have lifecycle methods; with hooks, useEffect covers all three depending on how we set the dependency array and cleanup.

10. List some lifecycle methods and explain what do they do.
ComponentDidMount runs once after the component mounts — great for data fetching. componentDidUpdate runs after every update, so we can react to prop or state changes. componentWillUnmount runs right before removal — we use it to clean up timers or subscriptions. In hooks, all three are handled by useEffect.

11. What is the execution order of constructor, render, and lifecycle methods?
On mount: constructor runs first, then render, then componentDidMount. On update: render runs, then componentDidUpdate. On unmount: componentWillUnmount runs. The constructor only fires once — render fires every time something changes.

12. Describe the use case of lifecycle methods.
We use them for side effects — anything that touches the world outside React. componentDidMount for initial data fetching or setting up subscriptions; componentDidUpdate for reacting to changes like re-fetching when an ID prop changes; componentWillUnmount for cleanup. In hooks, useEffect covers all of these.

13. What is React strict mode?
Strict mode is a development-only wrapper that helps surface potential problems — things like unsafe lifecycle usage, deprecated APIs, and side effects in render. It intentionally double-invokes some functions to expose impurity. It doesn't render anything visible and has no effect in production.

14. What are synthetic events and how are they different than DOM events?

Synthetic events are React's wrapper around native browser events. They give us a consistent API across browsers, and React uses event delegation under the hood, attaching one listener at the root. The interface mirrors native events, so we still get target, preventDefault, and stopPropagation.

15. List some common events that you used most.
OnClick for buttons and clickable elements, onChange for form inputs, onSubmit for forms, onKeyDown and onKeyUp for keyboard input, and onMouseEnter and onMouseLeave for hover effects. For focus we use onFocus and onBlur.

16. How do React handle errors?
React provides error boundaries — special components that catch errors in their child tree and render a fallback UI instead of crashing the whole app. We define them with componentDidCatch and getDerivedStateFromError. Note they only catch errors in rendering and lifecycle — not in event handlers or async code, which we still handle with try/catch.
