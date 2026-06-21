# HW5 Q & A

## 1. What are the differences between `call`, `apply`, and `bind`?

`call`, `apply`, and `bind` are used to control what `this` refers to.

`call` runs the function immediately and passes arguments one by one.

`apply` runs the function immediately and passes arguments as an array.

`bind` does not run the function immediately. It returns a new function with `this` fixed.

## 2. Explain the `this` keyword in JavaScript.

`this` refers to the object that is calling the function.

Its value depends on how the function is called, not where the function is written.

In arrow functions, `this` comes from the outer scope.

## 3. Explain the Event Loop in JavaScript.

JavaScript runs on a single main thread, so it can only execute one thing at a time.

The event loop is the scheduling mechanism that helps JavaScript handle asynchronous tasks without blocking the main thread.

JavaScript runs synchronous code first. Async tasks like timers or API responses are handled by browser APIs. When they are ready, their callbacks wait in a queue. The event loop puts them back into the call stack when the stack is empty.

## 4. What are closures?

A closure happens when a function remembers variables from its outer scope, even after the outer function has finished running.

Closures are useful for private data and functions that need to keep state.

## 5. What is asynchronous code in JavaScript? How does JavaScript achieve asynchronous code?

Asynchronous code means some work can start now and finish later without blocking the rest of the program.

JavaScript needs this because the main thread can only execute one thing at a time.

JavaScript achieves async code with browser APIs, callback queues, the event loop, promises, and `async` / `await`.

## 6. What is `async` and `await`? How do we use them?

`async` and `await` are syntax for writing promise-based asynchronous code in a cleaner way.

`async` makes a function return a promise.

`await` can only be used inside an async function. It pauses that async function until the promise is resolved or rejected.

It makes asynchronous code look more like normal synchronous code, but it does not block the whole JavaScript program.

## 7. How many HTTP methods are there? Explain each one.

Common HTTP methods include `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, and `OPTIONS`.

`GET` reads data. `POST` creates data. `PUT` replaces data. `PATCH` updates part of data. `DELETE` removes data. `HEAD` gets headers only. `OPTIONS` asks what methods are supported.

`POST` is usually used to create a new resource. `PUT` is usually used to replace an existing resource.

## 8. What is a Promise?

A promise is an object that represents an asynchronous operation.

It can finish successfully with a value, or fail with an error.

## 9. What is promise chaining?

Promise chaining means using multiple `.then()` calls one after another.

Each `.then()` can return a value or another promise, and the next `.then()` receives that result.

## 10. Explain the three states of a Promise.

A promise has three states: pending, fulfilled, and rejected.

`pending` means it is still waiting. `fulfilled` means it succeeded. `rejected` means it failed.

## 11. What is the use of `Promise.all`? How is it different from `Promise.allSettled`?

`Promise.all` runs multiple promises together and waits for all of them to succeed.

If one promise fails, `Promise.all` fails immediately.

`Promise.allSettled` waits for all promises to finish, whether they succeed or fail.

## 12. What is a callback function?

A callback function is a function passed into another function as an argument.

It is called later, usually after something happens, like a click event, timer, or async operation.

## 13. Difference between 401 and 403 error code.

`401` means the user is not authenticated, so they need to log in.

`403` means the user is authenticated, but they do not have permission to access the resource.

## 14. What does `response.json()` do when fetching an API?

`response.json()` reads the response body and parses it as JSON.

It returns a promise, so we usually use `await response.json()`.

## 15. Describe the difference between a cookie, `sessionStorage`, and `localStorage` in browsers.

Cookies are small pieces of data that can be sent to the server with requests.

`sessionStorage` stores data only for the current browser tab session.

`localStorage` stores data in the browser with no expiration by default, even after closing the browser.

## 16. What is the output of the following code?

```js
(function (a) {
  return (function () {
    console.log(a);
    a = 23;
  })();
})(45);
```

The output is `45`.

The inner function forms a closure and remembers the outer function's `a`. It logs `a` first, so it prints `45`, then changes `a` to `23`.
