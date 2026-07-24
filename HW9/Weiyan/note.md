# HW9 Redux Fundamental

## 1. What is the Flux architecture?

 Flux is an architecture for the purpose of better state management in front-end. Its core idea is the unidirectional data flow. That is, the user's interaction creates an action object, then it is handled by the dispatcher, then the state is updated at the store, and finally, the view re-renders to reflect the new state.

 Most importantly, the Flux architecture inspired Redux.

## 2. Explain what the Redux store, actions, reducers are and what they do

- The store is the centralized place where the states live. It acts as a coordinator: it receives actions and dispatches them to the reducers to compute the next state, and then notifies the UI components to re-render.

- An action is an object that describes an event that happened in the application (for example, a user's interaction). It contains a `type` property indicating what happened, and optionally a `payload`.

- A reducer is a function that updates the state according to the action object.

## 3. Describe the work flow of Redux

 So the core of Redux workflow is Unidirectional Data Flow. The cycle begins in the View, which is actually the UI. The user's interaction with the UI leads to the component to create an Action object, and dispatches it to the Store. The Store receives the action, and it passes the action together with the current state to the Reducer.

 The reducer is a pure function that handles the action, and returns a new state object. The Store takes the new state object and replaces the old one. It then emits a notification to all subscribed components saying the data has changed. Thus the subscribed components will re-render to reflect the updated data.

## 4. How do you create/configure a store in redux?

 I will import `configureStore` from Redux toolkit, and pass it an object which contains a `reducer` property where I list all slice reducers here. And I will also add the `middleware` property to list custom middlewares.

 This happens in the `store.js`.

## 5. Explain how to use `connect()`

 In most cases, we pass the two mapping functions, `mapStateToProps` and `mapDispatchToProps` to `connect()`, which returns an HOC. We then pass our component to this HOC.

 We write this statement at the exporting of a component.

## 6. What is `mapDispatchToProps` and what does it do?

 `mapDispatchToProps` takes the dispatch function and passes your action-triggering functions into your component as props.

## 7. What is `mapStateToProps` and what does it do?

 `mapStateToProps` takes the global state object in the Redux store and returns an object that maps those state values to the component's props.

## 8. How do we use `useSelector` and `useDispatch`?

- `useSelector` helps the component extract a specific piece of data from the Redux global state and triggers a re-render whenever that specific data changes.

- `useDispatch` allows the component to send the action object to the Redux store, which then triggers the reducer to update the state.
