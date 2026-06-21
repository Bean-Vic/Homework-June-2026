1. How do we do prop types check?

PropTypes is used to validate the props passed into a component.
It helps catch type-related bugs during development.

2. What is Prop Drilling?
Prop drilling happens when data needs to be passed through multiple levels of components.
If GrandChild needs user data, every component in between has to pass it down.
To avoid pop drilling, we can use Context API or Redux.

3. How are we going to render a variable as a React component?
return <Component />;
This is useful when rendering components dynamically.

4. What is HOC and why do we need it?
HOC stands for Higher Order Component.
It is a function that takes a component and returns a new component.
Used for authentication, logging, permissions, loading states, etc.

5. How do we render SVG as a React component?
import { ReactComponent as Logo } from "./logo.svg";
return <Logo />;

6. What is lazy loading and why do we need it?

const Dashboard = React.lazy(() =>
  import("./Dashboard")
);
<Suspense fallback={<p>Loading...</p>}>
  <Dashboard />
</Suspense>

Benefits:
Smaller bundle size
Faster initial page load
Better performance

7. List several React hooks that you use most.
useState
Manages component state.

useEffect
Handles side effects.

useMemo
Caches expensive calculations.

useCallback
Caches functions.

useRef
Stores DOM references or mutable values.


8. What is useState?
useState manages local component state.

9. What is useEffect and why do we need it?
useEffect handles side effects such as: API requests, event listeners,subscriptions,localStorage

10. What is dependency array?
useEffect(() => {}, []);
Runs once after mount.

useEffect(() => {}, [count]);
Runs when count changes.

useEffect(() => {});
Runs after every render.

11. componentDidUpdate equivalent?
useEffect(() => {
  console.log("updated");
}, [count]);

12. componentDidMount equivalent?

useEffect(() => {
  fetchData();
}, []);

13. componentWillUnmount equivalent?
useEffect(() => {
  return () => {
    console.log("cleanup");
  };
}, []);


14. Difference between useCallback and useMemo?
useMemo caches a value.
useCallback caches a function.
Rule:
useMemo → value
useCallback → function

15. Difference between useContext and useState?
useState manages local component state.
useContext shares data across components.
useState stores state.
useContext provides access to shared state.
