# HW7 React 102 & Hooks

## 1. How do we do prop types check?

 We use the `prop-types` library. After defining a component, we can attach a `.propTypes` object to it to specify the expected data types and whether each prop is required.

## 2. What is Prop drilling?

 Prop drilling occurs when a deeply nested component needs access to data from a top-level component. This requires the props to be passed down through multiple intermediate layers, even if those middle components don't actually use these props.

## 3. How are we going to render a variable as a React component?

 If the component is stored as a variable, I'll make sure the variable name is capitalized, and I will render it as a JSX component using a self-closing tag.

## 4. What is HOC and why we need it?

 HOC, or Higher-Order Component, is a function that takes a component and returns a new component with enhanced behavior. We use HOCs to apply cross-cutting logic across multiple components. (They act as pluggable wrappers that enhance components with shared features.)

## 5. How to properly render an SVG element as a React component?

 We can use the SVGR tool, but it requires installation or import if we are using Next.js or Vite. Or we can take the raw SVG code and wrap it in a standard React component with the HTML tag of `svg`.

## 6. What is lazy loading and what does it help?

 Lazy loading means to defer the initialization or downloading of a resource until it is explicitly needed.
 It is helpful for saving time for loading the initial page, and eventually saves bandwidth and server costs.

## 7. List several react hooks that you use most and what do they do?

- `useState` for creating a state.
- `useEffect` for adding side effects.
- `useMemo` for memorizing a value.
- `useCallback` for caching a function in order to prevent unnecessary re-render of child components.
And
- `useRef` for holding a mutable value across renders or for accessing DOM elements.

## 8. What is `useState` and what value we should pass in as prop?

 `useState` is the hook used for creating a state for a component. It defines the initial value of the state and creates the `set` function for updating the state.

 We pass in the initial value for that state to `useState`.

## 9. what is the hook `useEffect` and why we need it?

 `useEffect` is used for adding side effects to be performed when a state changes, or a component gets rendered or re-rendered. We need it for the same reason as the lifecycle methods, that is to perform side effects.

## 10. What is dependency array in `useEffect`?

 Dependency array is used to define when the side effects will be triggered. It takes the name of a state or props, so to run the side effects when the variable has changed. We can also use an empty dependency array, which tells React to run these side effects only once when the component first mounts.

## 11. What is the lifecycle method `componentDidUpdate` equivalent hook?

 I would say it is the `useEffect` with a dependency array containing state variables. However it is not a perfect substitution, because `useEffect` with a dependency array also runs on the initial mount.

## 12. What is the lifecycle method `componentDidMount` equivalent hook?

 It is the `useEffect` hook with an empty dependency array.

## 13. What is the lifecycle method `componentWillUnmount` equivalent hook?

 It is the `useEffect` hook that returns a callback function and has an empty dependency array.

## 14. What’s the difference between `useCallback` and `useMemo`?

- `useCallback` is to staple the address of a function in memory (to maintain the referential equality of a function) so that it won't be recognized as a different function each time the element gets rerendered.
- `useMemo` is used to memorize the result of a calculation, which is a value, not a function.

## 15. What is `useContext` and the difference between `useContext` and `useState`?

- `useContext` allows a component to read data from a Context Provider, so to avoid Prop Drilling.
- `useState` actually creates and manages a state variable inside a component, while `useContext` doesn't create state at all, it grabs a value that was already provided by a Context Provider higher up in the component tree.
