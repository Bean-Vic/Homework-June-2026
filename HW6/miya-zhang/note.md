## 1. What is a SPA?

A SPA means Single Page Application. It loads one main HTML page first, and then uses JavaScript to update the content without refreshing the whole page every time. When users click links or buttons, the page usually changes dynamically instead of doing a full reload. This makes the user experience feel faster and smoother. I understand SPA as a web app that behaves more like a real application.

## 2. What is JSX?

JSX is a syntax that lets us write HTML-like code inside JavaScript. It is not exactly HTML, but it looks very similar, so it makes React components easier to read. With JSX, we can describe the UI structure directly inside a component. Behind the scenes, JSX will be converted into regular JavaScript. For me, JSX is a convenient way to write React UI.

## 3. What is Virtual DOM?

Virtual DOM is a lightweight copy of the real DOM. When state or props change, React updates the Virtual DOM first, compares it with the previous version, and then updates only the necessary parts of the real DOM. This helps avoid unnecessary DOM changes. Since changing the real DOM can be expensive, Virtual DOM makes React updates more efficient. It helps React keep the UI fast.

## 4. What does ReactDOM.render() do?

ReactDOM.render() is used to render a React component into a real DOM element, usually the root element in the HTML file. It is the step that connects the React app with the browser page. For example, it can render the App component inside the div with id root. In newer React versions, createRoot is more commonly used, but the main idea is similar. Its main purpose is to display the React app on the webpage.

## 5. What are props?

Props are data passed from a parent component to a child component. They work like function parameters. A child component can use props to display different content, but it should not directly modify them. For example, a parent can pass a username or title to a child component. So props are mainly used to pass data down and make components reusable.

## 6. How do prop updates affect rendering?

When props change, React will re-render the component that receives those props. Then the component can show the updated data on the page. For example, if a parent passes a new name to a child component, the child will display the new name after rendering. React does not need to refresh the whole page, only the related UI updates. So prop changes are one common reason for React components to render again.

## 7. What is a state, and how do you update it? Can you mutate it directly?

State is data managed inside a component. It is used when the UI needs to change based on user actions or other updates. In function components, we usually use useState to create and update state. We should not mutate state directly, because React may not notice the change and the UI may not update correctly. The proper way is to use the state update function, like setCount or setValue.

## 8. What is the difference between a controlled component and uncontrolled component?

A controlled component is controlled by React state. For example, the value of an input is stored in state, and every change updates that state. An uncontrolled component keeps its value in the DOM itself, and we usually use a ref to read the value when needed. Controlled components are better when we need validation or real-time updates. I usually choose controlled components when I need more control over form data.

## 9. Explain the React component lifecycle.

The React component lifecycle describes the different stages of a component. A component can be created, updated, and removed from the page. In class components, these stages are called mounting, updating, and unmounting. In function components, we often use useEffect to handle similar logic. So lifecycle helps us know when to run code like fetching data, updating something, or cleaning up.

## 10. List some lifecycle methods and explain what they do.

Some common lifecycle methods are componentDidMount, componentDidUpdate, and componentWillUnmount. componentDidMount runs after the component first appears on the page, so it is often used for API calls. componentDidUpdate runs after props or state change, so it can respond to updates. componentWillUnmount runs before the component is removed, and it is useful for cleanup, like clearing timers. These methods help manage side effects during different component stages.

## 11. What is the execution order of constructor, render, and lifecycle methods?

In a class component, the constructor runs first. Then render runs to return the UI structure. After the component is mounted on the page, componentDidMount runs. When props or state change later, render runs again, and then componentDidUpdate runs. Before the component is removed, componentWillUnmount runs. The order follows the component from creation to update and finally removal.

## 12. Describe the use case of lifecycle methods.

Lifecycle methods are useful when we need to run code at specific moments. For example, after a component is mounted, we may fetch data from an API. When a component updates, we may compare old props with new props. Before a component is removed, we may clean up timers, subscriptions, or event listeners. So lifecycle methods help keep component behavior organized and avoid unnecessary problems.

## 13. What is React strict mode?

React Strict Mode is a development tool that helps find potential problems in a React app. It does not change the production behavior, but in development it can show warnings and check unsafe patterns. For example, it can help detect some lifecycle issues or unexpected side effects. It is useful when we want to write cleaner React code. So I see it as a tool that helps improve code quality.

## 14. What are synthetic events and how are they different from DOM events?

Some common React events I use are onClick, onChange, onSubmit, onFocus, onBlur, onMouseEnter, and onMouseLeave. I use onClick for buttons, onChange for input fields, and onSubmit for forms. onFocus and onBlur are useful for form validation or input interactions. These events connect user actions with component logic. They are very common when building interactive pages.

## 16. How does React handle errors?

React can handle rendering errors with error boundaries. An error boundary catches errors in its child component tree and shows a fallback UI instead of crashing the whole page. For API errors, we usually use try-catch or catch blocks and show an error message to the user. Error boundaries mainly handle UI rendering errors, not every kind of error. In practice, React error handling usually combines error boundaries with normal JavaScript error handling.
