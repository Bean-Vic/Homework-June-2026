## 1. How do we do prop types check?

We can use PropTypes to check the type of props. First, we import PropTypes from prop-types. Then we define propTypes for the component. I can set name as a string, age as a number, and isStudent as a boolean.
This helps me catch mistakes when I pass the wrong type of data into a component.

## 2. What is prop drilling?

Prop drilling means passing props through many components, even if some middle components do not really need those props. They just pass the data down to another child component. For example, App passes data to Parent, then Parent passes it to Child. If the project gets bigger, this can be annoying and messy.

## 3. How are we going to render a variable as a React component?

If the variable stores a component, I need to use it with a capital letter. I can say: const Page equals HomePage, and then return Page as a component. If it is just a normal value, I can put it inside curly braces. For example, const message equals hello, then I can render message inside a paragraph tag.

## 4. What is HOC and why we need it?

HOC means Higher Order Component. It is a function that takes a component and returns a new component with extra behavior. I think it is useful when different components need the same logic. For example, checking login status or adding loading logic. But now in React, hooks are used more often for this kind of shared logic.

## 5. How to properly render an SVG element as a React component?

One way is to import the SVG as a React component:
import { ReactComponent as Logo } from "./logo.svg";
function App() {
return <Logo />;
}
Another way is to write the SVG code directly in JSX. But I need to be careful because some SVG attributes need React format, like className instead of class.

## 6. What is lazy loading and what does it help?

Lazy loading means loading a component only when it is needed, not all at the beginning.
const About = React.lazy(() => import("./About"));
It helps the app load faster at first, because the browser does not need to download everything immediately.

## 7. List several React hooks that you use most and what do they do?

I mainly use useState to manage local data and useEffect for side effects like data fetching. I rely on useContext to avoid prop-drilling, and useRef to store values without triggering a re-render. For performance optimization, I use useMemo to cache heavy calculations and useCallback to keep function references stable.

## 8. What is useState and what value we should pass in as prop?

useState is a React hook used to create state in a function component. const [count, setCount] = useState(0);
The value passed into useState is the initial value. It depends on what kind of data I need. For example, number can be 0, text can be "", boolean can be false, list can be [], and object can be {}.

## 9. What is the hook useEffect and why we need it?

useEffect lets me run code after the component renders. It is used for things that are not directly rendering UI, like API calls, timers, event listeners, or updating the document title.
For example:
useEffect(() => {
console.log("component rendered");
}, []);
I need it because React rendering should stay clean, and side effects should be handled separately.

## 10. What is dependency array in useEffect?

The dependency array tells React when the effect should run.
useEffect(() => {
console.log("run once");
}, []);
If the array is empty, it runs once after the first render.
If I put a value inside, it runs when that value changes.
If there is no dependency array, it runs after every render.

## 11. The similar hook is useEffect with dependencies.

The similar hook is useEffect with dependencies. If I put count in the dependency array, the effect runs when count changes. One thing to remember is that useEffect also runs after the first render, so it is not exactly the same as componentDidUpdate.

## 12. What is the lifecycle method componentDidMount equivalent hook?

The equivalent is useEffect with an empty dependency array.
useEffect(() => {
console.log("component mounted");
}, []);
This runs only once after the component first appears on the page.

## 13. What is the lifecycle method componentWillUnmount equivalent hook?

The equivalent is the cleanup function inside useEffect.
useEffect(() => {
return () => {
console.log("component unmounted");
};
}, []);
This is useful when I need to clean up something, like a timer or event listener.

## 14. What’s the difference between useCallback and useMemo?

useCallback is used to remember a function.
const handleClick = useCallback(() => {
console.log("clicked");
}, []);
useMemo is used to remember a calculated value.
const total = useMemo(() => price \* quantity, [price, quantity]);
So I think of it like this: useCallback is for functions, and useMemo is for values.

## 15. What is useContext and the difference between useContext and useState?

useContext is used to get shared data from a context. It helps avoid prop drilling when many components need the same data.
useState is more for local state inside one component.
useContext is more for shared state or shared data across different components.
For example, theme, user info, or language setting can use context.
