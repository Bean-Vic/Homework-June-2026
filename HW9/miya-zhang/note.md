## 1. What is the Flux architecture?

It’s a design pattern introduced by Facebook for building client-side web applications. The core concept is unidirectional data flow. Instead of components directly modifying data and passing it around chaotically, data flows in a strict, single direction: Action -> Dispatcher -> Store -> View. It makes debugging and tracking state changes much more predictable.

## 2. Explain what the Redux store, actions, reducers are and what they do.

Store: It's the single source of truth for the app. It holds the entire global state tree.
Actions: They are just plain JavaScript objects that describe what happened (like a user clicking "submit"). They must have a type property.
Reducers: They are pure functions that take the current state and the dispatched action, and return a brand new state object. They define how the state actually changes.

## 3. Describe the work flow of Redux.

It’s a strict one-way loop. A user interacts with the UI, which triggers an Action. We dispatch that action to the Redux store. The store passes the current state and the action to the Reducer. The Reducer calculates and returns the new state. Finally, the Store saves this new state and triggers the UI to re-render with the updated data.

## 4. How do you create/configure a store in redux?

In modern Redux (using Redux Toolkit, which is the standard now), we use the configureStore() API. We just pass it an object containing our reducers. It’s great because it automatically sets up good defaults for us, like the Redux Thunk middleware and Redux DevTools. (Note: If they ask about legacy Redux, mention we used to use createStore() but it's deprecated).

## 5. Explain how to use connect().

connect() is a Higher-Order Component (HOC) from react-redux used mostly in older React class components. You wrap your component with it to link it to the Redux store. It takes two main arguments (mapStateToProps and mapDispatchToProps) and essentially injects the global state and dispatch functions into your component as props. Honestly, I rarely use it anymore since Hooks were introduced.

## 6. What is mapDispatchToProps and what does it do?

It’s the second argument you pass to connect(). It’s used to bind your action creators to the store's dispatch function. It packages these dispatched actions into an object, which then gets passed down to your component as props. So inside the component, you can just call something like this.props.submitForm() directly.

## 7. What is mapStateToProps and what does it do?

It’s the first argument for connect(). It's a function that takes the entire Redux global state tree as an argument, and extracts only the specific pieces of data that this particular component needs. It returns an object, and those values become available as props inside the component.

## 8. How do we use useSelector and useDispatch?

These are the modern React Hooks for Redux, and they are my go-to approach.
1.useSelector completely replaces mapStateToProps. You pass it a callback function to extract exactly what piece of state you need from the store.
2.useDispatch replaces mapDispatchToProps. It simply gives you the dispatch function so you can fire off actions directly from inside your functional component. It makes the code much cleaner and easier to read.
