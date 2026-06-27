1. How do we do prop types check?
The classic way is the prop-types package — we define types like MyComponent.propTypes = { name: PropTypes.string.isRequired }, and React warns in dev mode if props don't match. In modern projects, we usually use TypeScript instead, since it catches issues at compile time rather than runtime.

2. What is Prop drilling?
Prop drilling is when we pass props through many intermediate components just to get them to a deeply nested child. The middle components don't actually use the data — they just forward it. It gets messy fast, and we usually fix it with Context or a state management library like Redux or Zustand.

3. How are we going to render a variable as a react component?
We assign the component to a capitalized variable, then use it like a JSX tag. For example, const MyComp = isLoggedIn ? Dashboard : Login, then <MyComp />. The capitalization matters — lowercase tags get treated as HTML elements.

4. What is ***HOC*** and why we need it?
HOC stands for Higher-Order Component. It's a function that takes a component and returns a new enhanced one — like withAuth(MyComponent). We use it to reuse logic across components, like authentication checks or data fetching. These days, custom hooks usually replace HOCs since they're cleaner.

5. How to properly render an SVG element as a react component?
The cleanest way is to import the SVG directly as a component — like import { ReactComponent as Logo } from './logo.svg' in Create React App, or use a plugin like vite-plugin-svgr in Vite. Then we use it like <Logo />. This lets us style it with CSS and pass props like color or size.

6. What is lazy loading and what does it help?
Lazy loading means we only load code or assets when they're actually needed. In React, we use React.lazy together with Suspense to split components into separate bundles loaded on demand. It reduces the initial bundle size and makes the app load faster — especially helpful for routes the user might never visit.

7. List several react hooks that you use most and what do they do?
`useState`  for local component state, `useEffect` for side effects like data fetching, `useContext` to consume context values, `useRef` to hold mutable references or DOM nodes, `useMemo` to cache expensive calculations, and `useCallback` to memoize functions.

8. what is `useState` and what value we should pass in as prop?
`useState`  is the hook for adding local state to a function component. We pass in the initial value, and it returns an array with the current state and a setter — like const [count, setCount] = useState(0). If the initial value is expensive to compute, we can pass a function instead so it only runs once.

9. what is the hook `useEffect` and why we need it?
`useEffect` lets us perform side effects in function components — things like data fetching, subscriptions, or manually touching the DOM. We need it because the render function itself should be pure. Effects run after render, so they don't block the UI from displaying.

10. What is dependency array in `useEffect`?
The dependency array tells React when to re-run the effect. If we pass an empty array, it runs only once after mount. If we pass values, it re-runs whenever any of them change. If we omit it entirely, it runs after every render — which is usually a bug.

11. What is the lifecycle method `componentDidUpdate` equivalent hook?
It's `useEffect` with a dependency array of values we want to watch — like useEffect(() => { ... }, [propA, stateB]). Whenever one of those values changes, the effect re-runs, which mirrors componentDidUpdate.

12. What is the lifecycle method `componentDidMount` equivalent hook?
It's `useEffect` with an empty dependency array — useEffect(() => { ... }, []). The empty array means the effect runs only once, right after the component mounts. In React 18 strict mode, it runs twice in dev to help catch bugs.

13. What is the lifecycle method `componentWillUnmount` equivalent hook?
It's the cleanup function we return from useEffect — useEffect(() => { ... return () => cleanup() }, []). The returned function runs when the component unmounts, or before the effect re-runs. We use it to clear timers, cancel subscriptions, or remove listeners.

14. What’s the difference between `useCallback` and `useMemo`?
`useMemo` caches a computed value, while `useCallback` caches a function reference. So useMemo(() => compute(), deps) returns the result, but useCallback(fn, deps) returns the function itself. We use them to avoid expensive recomputation or to keep stable references when passing props to memoized children.
15. What is `useContext` and the difference between `useContext` and `useState`?
`useContext` reads a value from a React Context, so we can share data across the component tree without prop drilling. `useState` creates local state inside one component. So `useState` is local — for component-owned data; `useContext` is global-ish — for data many components need to read. They're often used together: state lives in one place, context distributes it.
