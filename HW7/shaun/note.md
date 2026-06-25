1. How do we do prop types check?
   We use PropTypes or TypeScript to validate the types of props passed to React components.
2. What is Prop drilling?
   Prop drilling is the process of passing props through multiple intermediate components to reach a deeply nested component.
3. How are we going to render a variable as a react component?
   We can store a component in a capitalized variable and render it using JSX like <MyComponent />.
4. What is **_HOC_** and why we need it?
   A Higher-Order Component (HOC) is a function that takes a component and returns a new component to reuse logic across components.
5. How to properly render an SVG element as a react component?
   SVG can be imported as a React component and rendered directly in JSX.
6. What is lazy loading and what does it help?
   Lazy loading loads components only when they are needed, reducing initial bundle size and improving performance.
7. List several react hooks that you use most and what do they do?
   Common hooks include useState for state, useEffect for side effects, useMemo for memoized values, useCallback for memoized functions, and useContext for shared data.
8. what is `useState` and what value we should pass in as prop?
   useState is used to manage component state, and its argument is the initial state value.
9. what is the hook `useEffect` and why we need it?
   useEffect is used to perform side effects such as data fetching, subscriptions, and timers after rendering.
10. What is dependency array in `useEffect`?
    The dependency array controls when useEffect runs by specifying which values React should watch for changes.
11. What is the lifecycle method `componentDidUpdate` equivalent hook?
    componentDidUpdate can be implemented using useEffect with a dependency array.
12. What is the lifecycle method `componentDidMount` equivalent hook?
    componentDidMount is equivalent to useEffect(() => {}, []).
13. What is the lifecycle method `componentWillUnmount` equivalent hook?
    componentWillUnmount is equivalent to the cleanup function returned by useEffect.
14. What’s the difference between `useCallback` and `useMemo`?
    useCallback memoizes a function, while useMemo memoizes a computed value.
15. What is `useContext` and the difference between `useContext` and `useState`?
    useContext accesses shared data across components, while useState manages local component state.
