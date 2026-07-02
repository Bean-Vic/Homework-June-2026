


### 1. 问答练习(八股)

准备以下⼋股题⽬答案, 写在`note.md`⾥

<aside>

1. How do we do prop types check?
In older JavaScript React projects, this is often done with the prop-types library, where you define expected types like string, number, function, array, or object. In modern projects, TypeScript is more common because it checks prop types during development before the app runs.

2. What is Prop drilling?
Prop drilling means passing data through many levels of components just to get it to a deeply nested child component.

3. How are we going to render a variable as a react component?
To render a variable as a React component, the variable must reference a valid React component, and its name should usually start with a capital letter.

4. What is ***HOC*** and why we need it?
HOC means Higher-Order Component. It is a function that takes a React component as input and returns a new component with extra behavior or data added to it. We need HOCs when we want to reuse the same logic across many components without copying code, such as authentication checks, permissions, logging, analytics, or shared data loading.

5. How to properly render an SVG element as a react component?
To properly render an SVG as a React component, you can either import the SVG as a component if your setup supports it, or copy the SVG code directly into JSX.

6. What is lazy loading and what does it help?
Lazy loading means loading something only when it is actually needed, instead of loading everything at the start. In React, this usually means loading a component, route, image, or module later, when the user reaches that part of the app. It helps reduce the initial bundle size, makes the first page load faster, improves performance, and avoids wasting resources on code or assets the user may never use.

7. List several react hooks that you use most and what do they do?
The React hooks I use most are useState, useEffect, useContext, useRef, useMemo, and useCallback. useState is used to store and update local component state. useEffect is used for side effects like fetching data, setting timers, or subscribing to events. useContext is used to read shared global-like data from a context, such as user info or theme. useRef is used to reference DOM elements or store values that should not trigger a re-render. useMemo is used to memoize expensive calculated values so they do not recalculate unnecessarily. useCallback is used to memoize functions so they do not get recreated on every render.

8. what is `useState` and what value we should pass in as prop?
useState is a React hook that lets a functional component store and update local state. It returns two things: the current state value and a function to update that value. The value we pass into useState is the initial state, not a prop. That initial value can be a string, number, boolean, array, object, null, or any value your component needs to remember.

9. what is the hook `useEffect` and why we need it?
useEffect is a React hook used to run side effects after a component renders. A side effect is anything that affects something outside the normal rendering process, such as fetching data from an API, setting up event listeners, starting timers, updating the document title, or subscribing to data. We need useEffect because React rendering should mainly describe what the UI looks like, while useEffect handles extra work that needs to happen after the UI is rendered.

10. What is dependency array in `useEffect`?
The dependency array in useEffect controls when the effect runs. If you do not pass a dependency array, the effect runs after every render. If you pass an empty array, the effect runs only once after the component first mounts. If you put variables inside the array, the effect runs again whenever one of those variables changes.

11. What is the lifecycle method `componentDidUpdate` equivalent hook?
The hook equivalent of componentDidUpdate is useEffect with a dependency array. It runs after the component renders and runs again when the values in the dependency array change.

12. What is the lifecycle method `componentDidMount` equivalent hook?
The hook equivalent of `componentDidMount` is `useEffect` with an empty dependency array. That means the effect runs once after the component first renders. It is commonly used for setup logic, such as fetching initial data, adding event listeners, starting timers, or initializing something when the component appears on the screen.

13. What is the lifecycle method `componentWillUnmount` equivalent hook?
The hook equivalent of componentWillUnmount is the cleanup function inside useEffect. In useEffect, you can return a function, and React will run that function when the component is about to unmount. This is used to clean up things like timers, event listeners, subscriptions, WebSocket connections, or API requests, so they do not keep running after the component is gone.

14. What’s the difference between `useCallback` and `useMemo`?
`useCallback` memoizes a function, while `useMemo` memoizes a computed value. You use `useCallback` when you want to keep the same function reference between renders, often when passing a function to a child component or using it in another hook’s dependency array. You use `useMemo` when you have an expensive calculation and you do not want to recalculate the result unless its dependencies change. So the simple difference is: `useCallback` saves the function itself, `useMemo` saves the result of running logic.

15. What is `useContext` and the difference between `useContext` and `useState`?
`useContext` is a React hook that lets a component read shared data from a React Context without passing props through every level. It is useful for data many components need, like theme, logged-in user, language, or auth status. The difference is that `useState` manages local state inside one component, while `useContext` reads shared state or values provided from a parent context. So use `useState` when only one component needs to remember something, and use `useContext` when many components across the app need access to the same data.


</aside>