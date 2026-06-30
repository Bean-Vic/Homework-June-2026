What is the Flux architecture?
Flux is an application architecture where data flows in one direction: action → dispatcher → store → view.
Explain what the Redux store, actions, reducers are and what they do.
The store holds application state, actions describe what happened, and reducers update state based on actions.
Describe the work flow of Redux
In Redux, the UI dispatches an action, the reducer calculates the new state, the store updates, and the UI re-renders.
How do you create/configure a store in redux?
We create a Redux store using configureStore() from Redux Toolkit and pass reducers into it.
Explain how to use connect()
connect() connects a React component to the Redux store by passing state and dispatch functions as props.
What is mapDispatchToProps and what does it do?
mapDispatchToProps maps dispatch functions to component props so the component can trigger actions.
What is mapStateToProps and what does it do?
mapStateToProps maps Redux store state to component props so the component can read global state.
how do we use useSelector and useDispatch?
useSelector reads data from the Redux store, while useDispatch returns the dispatch function to send actions.
