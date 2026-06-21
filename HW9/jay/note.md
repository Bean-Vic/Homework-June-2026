


### 1. 问答练习(八股)

准备以下⼋股题⽬答案, 写在`note.md`⾥

<aside>

1. What is the Flux architecture?
Flux is a front-end application architecture pattern created by Facebook to manage data flow in React apps. Its main idea is one-way data flow: a user action triggers an action, the action is sent through a dispatcher, the dispatcher updates the store, and the store causes the view/UI to re-render with the new data. This makes state changes more predictable because data always moves in one direction instead of being changed from many places.

2. Explain what the Redux store, actions, reducers are and what they do.
In Redux, the store is the central place that holds the application’s shared state, like user info, cart items, or UI settings. Actions are plain objects that describe what happened, such as “user logged in” or “item added to cart”; they usually have a type and sometimes extra data called a payload. Reducers are functions that decide how the state should change based on the action; they take the current state and an action, then return a new updated state. The important idea is that components do not directly change the store; they dispatch actions, reducers process those actions, and the store updates predictably.

3. Describe the work flow of Redux
The Redux workflow follows a predictable one-way data flow: first, the UI/component triggers something, like a button click or form submit; then the component dispatches an action that describes what happened; Redux sends that action to the reducer; the reducer looks at the current state and the action, then returns a new updated state; the store saves that new state; finally, React components that depend on that state re-render with the updated data.

4. How do you create/configure a store in redux?
You create/configure a Redux store by defining your reducers first, then passing them into a store configuration function. In modern Redux, you usually use Redux Toolkit with `configureStore`, where you combine your slice reducers into one store and then provide that store to your React app using the `<Provider>` component from `react-redux`. The store becomes the central state container for the app, and any component inside the provider can read state with `useSelector` and update state by dispatching actions with `useDispatch`.

5. Explain how to use `connect()` 
connect() is an older React-Redux API used mainly with class components to connect a React component to the Redux store. It takes functions like mapStateToProps and mapDispatchToProps: mapStateToProps chooses which pieces of Redux state should become props for the component, and mapDispatchToProps provides functions that dispatch actions as props. After that, connect() wraps your component and returns a new connected component that can read from the store and dispatch actions without manually passing props down. 

6. What is `mapDispatchToProps` and what does it do?
`mapDispatchToProps` is a function used with React-Redux `connect()` to give a component access to Redux action dispatching through props. Instead of calling `dispatch()` directly inside the component, you define functions that dispatch specific actions, then those functions are passed into the component as props. 

7. What is `mapStateToProps` and what does it do?
`mapStateToProps` is a function used with React-Redux `connect()` to choose which parts of the Redux store state should be passed into a component as props. It receives the current Redux state, selects the data the component needs, and returns an object where each key becomes a prop for that component.

8. how do we use `useSelector` and `useDispatch`?
`useSelector` and `useDispatch` are the modern React-Redux hooks used instead of `connect()`. `useSelector` lets a functional component read data from the Redux store by selecting the specific state it needs, like getting the current user, cart items, or theme value. `useDispatch` gives the component access to the Redux `dispatch` function, so the component can send actions to the store when something happens, like a button click or form submit. In simple terms, `useSelector` is for reading Redux state, and `useDispatch` is for updating Redux state by dispatching actions.

</aside>

