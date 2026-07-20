1. What is Redux Middleware?
Middleware is code that sits between dispatch and the reducer — it intercepts every action before it reaches the reducer. We use it for things like logging, crash reporting, or handling async operations. Common examples are redux-thunk and redux-saga. It's basically a pipeline where each middleware can inspect, modify, delay, or even cancel actions.

2. Describe the timing of redux middleware functions executed in the middle of FLUX flow.
When we call dispatch(action), the action first goes through the middleware chain in the order we registered them. Each middleware can do work before calling next(action) to pass it along. Once it reaches the end of the chain, the reducer runs and updates the store. So middleware sits between dispatch and reducer — before state changes.

3. How to apply middleware to redux store?
The old way is createStore(reducer, applyMiddleware(thunk, logger)). With Redux Toolkit, we use configureStore and pass a middleware option — like configureStore({ reducer, middleware: (getDefault) => getDefault().concat(sagaMiddleware) }). Toolkit includes thunk by default, so we usually just add custom middleware on top.

4. What is redux-saga?
Redux-saga is a middleware library for handling side effects in Redux — like async API calls or complex flows. It uses generator functions to make async code look synchronous and easy to test. Sagas listen for specific actions and run side-effect logic in response, separate from the components.

5. What is a generator function and how to use it?
A generator function is declared with function* and can be paused and resumed using yield. Calling it doesn't run the body — it returns an iterator, and we call .next() to step through each yield. In redux-saga, the library acts as the iterator runner, pausing the saga on each yield until the side effect resolves.

6. What's the advantage and disadvantage of using redux-saga compared with redux-thunk?
Saga's advantages are testability — since yields return plain objects, we can test the flow without mocking — and it handles complex async patterns like cancellation, debouncing, and race conditions cleanly. The downside is the learning curve — generators and effect creators are more complex. Thunk is simpler and good enough for most apps, so saga is overkill unless we have heavy async logic.

7. How to create and run a saga middleware?
We import createSagaMiddleware from redux-saga, call it to get the middleware instance, pass it to the store via applyMiddleware or configureStore, then call sagaMiddleware.run(rootSaga) to start the root saga. The root saga usually uses all([...]) to run multiple watcher sagas in parallel.

8. Compare takeLatest vs takeEvery.
Both listen for a specific action type and trigger a worker saga. takeEvery runs the worker for every matching action — they can run in parallel. takeLatest cancels any in-progress worker and only keeps the latest one — great for things like search-as-you-type, where we only care about the most recent request.

9. Compare fork vs spawn.
Both start a saga in the background without blocking. The difference is error handling: fork creates an attached child — if it throws, the parent catches it and gets canceled too. spawn creates a detached child — errors stay isolated and don't bubble up. So we use fork for related work and spawn for independent tasks we don't want crashing the parent.

10. How to call a function in a saga middleware function?
We use the call effect — like const data = yield call(fetchUser, userId). call invokes the function and waits for the result. The advantage over calling it directly is testability — call returns a plain effect object describing the call, which we can assert in tests without actually running the function.

11. How to acquire redux store value in a saga middleware function?
We use the select effect with a selector function — like const user = yield select(state => state.user). It reads the current state from the store and returns it. We use it when a saga needs context from the store before deciding what to do next, like checking if a user is logged in.
