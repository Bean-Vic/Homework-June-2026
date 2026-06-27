1. What is the Flux architecture?
Flux is a pattern from Meta for managing app state with one-way data flow. The flow goes: actions describe what happened, a dispatcher sends them to stores, stores update state, and views re-render. The key idea is unidirectional data flow — it makes state changes predictable and easier to debug. Redux is basically a simplified version of Flux.

2. Explain what the Redux store, actions, reducers are and what they do.
The store is a single source of truth that holds the entire app state. Actions are plain objects describing what happened — like { type: 'ADD_TODO', payload: 'Buy milk' }. Reducers are pure functions that take the current state and an action, then return the new state. The store calls reducers whenever an action is dispatched.

3. Describe the work flow of Redux.
A component dispatches an action. The store receives it and calls the root reducer with the current state and the action. The reducer returns a new state object. The store then notifies subscribed components, and any that depend on the changed slice re-render. It's one-way data flow — view → action → reducer → store → view.

4. How do you create/configure a store in redux?
These days we use Redux Toolkit, which is the official recommended way. We call configureStore({ reducer: { ... } }), passing in our slice reducers. It comes with Redux DevTools and redux-thunk built in. Then we wrap the app in <Provider store={store}> so all components can access it.

5. Explain how to use `connect()`.
`connect()` is the legacy API from React-Redux that links a component to the store. We call it like connect(mapStateToProps, mapDispatchToProps)(MyComponent), and it returns a wrapped component that receives state and dispatchers as props. In modern code, we mostly use the useSelector and useDispatch hooks instead — they're cleaner.

6. What is `mapDispatchToProps` and what does it do?
`mapDispatchToProps` is a function we pass to `connect` that defines which action dispatchers get injected as props. For example, we map `addTodo` to a prop that dispatches the corresponding action. So inside the component we just call this.props.addTodo() without touching store.dispatch directly.

7. What is `mapStateToProps` and what does it do?
`mapStateToProps` is a function that selects which pieces of the Redux state become props on the component. It takes the entire state and returns an object — like state => ({ todos: state.todos }). The component re-renders whenever any of those selected values change.

8. How do we use `useSelector` and `useDispatch`?
`useSelector` reads a piece of state from the store — like const todos = useSelector(state => state.todos). It re-renders the component when that slice changes.
`useDispatch` returns the dispatch function so we can fire actions — like const dispatch = useDispatch(), then dispatch(addTodo('Buy milk')). Together they replace the old connect pattern.
