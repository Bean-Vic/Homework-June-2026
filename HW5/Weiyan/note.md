# HW5 - Async JavaScript

## 1. What are the differences between `call`, `apply` & `bind`?

 `call` and `apply` are similar. They execute the function with a specified `this` context. Their only difference is that `apply` takes the arguments of the function as an array, while `call` takes the arguments of the function as individual arguments.

 Unlike `call` and `apply`, `bind` doesn’t immediately execute the function. It just returns a new version of the function whose `this` is set to a specified object.

## 2. Explain the `this` keyword in JavaScript

 `this` is like a pronoun that refers to which object is currently acting this function.

- When a function is called as a method of an object, `this` points to the object standing to the left of the dot.
- When you call a function without any object attached to it, `this` defaults to the global object.

## 3. Explain the Event Loop in JavaScript

 Event Loop is the mechanism that allows JavaScript to perform in a non-blocking, asynchronous manner. JavaScript is a single-threaded language with only one Call Stack, so when an async task like a timer or network request occurs, it is handed off to the environment's Web APIs to process. Once that background task is done, its callback is pushed into a queue: either the Microtask Queue for Promises, or the Macrotask Queue for other things like timeouts.

 The Event Loop's job is to constantly monitor the Call Stack. When the stack is empty, the Event Loop pushes the callbacks in the queue back onto the stack to be executed.

## 4. What are closures?

 A closure happens when there is a function inside another function, and the inner function uses variables from the outer function.

 A closure is this inner function, that remembers the variables around it. It has access to these variables even after the outer function has finished running.

## 5. What is asynchronous code in JavaScript? How does JavaScript achieve asynchronous code?

 Asynchronous code means non-blocking. It allows you to initiate a task that takes time, and set it aside, and continue running the rest of your code immediately. When that background task finishes, the engine notifies you and handles the result.

 JavaScript has only one call stack, and it can be asynchronous by delegating the waiting to the environment. (When an async task like a timer or network request occurs, it is handed off to the environment's Web APIs to process. Once that background task is done, the Event Loop places the callback function into a Queue, waiting until the call stack is empty to push them back to the stack to be executed.)

## 6. What is `async` & `await`? How do we use them?

 `async` & `await` is a pair of keywords used to write asynchronous code.

- `async` is a modifier placed before a function. It does two things: First, it allows the use of `await` inside the function. Second, it gives this function the ability to be waited on, essentially, it guarantees that the function will always return a Promise.
- `await` is used to pause the execution of the current function (the one it lives in), until a Promise is settled.

 We use them as an alternative for the chaining of `.then()` statements. We put `await` in front of the task we should be waiting for and assign the result directly to a variable, because `await` unwraps the Promise and returns the resolved value.

## 7. How many HTTP methods are there? Explain each one

 There are 9 HTTP methods in total.

 Five of them are about data manipulation; they are the most frequently used. They are GET, POST, PUSH, PATCH and DELETE.

- GET is used to request data from the server.
- POST is to submit data to the server.
- PUT is to replace current data on the server with the submitting data.
- PATCH is to partially modify the resource on the server.
- DELETE deletes the specified resource from the server.

 There are also four specialized methods. They are HEAD, OPTIONS, TRACE and CONNECT.

### a. What is the difference between POST and PUT?

 POST is used to create a new subordinate resource. It targets a collection URL, like `/users`, and executing a POST request will create a new record of data, or a new instance, that belongs to the collection.

 PUT, on the other hand, targets a specific item's URL, like `/users/001`. It replaces all the current data of the specific item with its payload.

## 8. What is a Promise?

 A Promise is an object that represents the eventual completion or failure of an asynchronous operation. It contains the state of the operation, and the eventual data or error it produces.

## 9. What is Promise chaining?

 Promise chaining is used to execute multiple asynchronous operations in a specific sequence, where the result of one operation is passed directly into the next.

## 10. Explain the three states of a `Promise`

 There are Pending, Fulfilled and Rejected. A Promise is always in one of these three mutually exclusive states.

- Pending is the initial state. It means the operation is not completed yet.
- Fulfilled means the operation is completed successfully. It is triggered by calling `resolve()`, which locks in the success state and holds the data for consumption.
- Finally, Rejected means the operation failed. We trigger this by calling `reject()`, which locks in the failure state and holds the error object.

## 11. What is the use of `Promise.all()`? How is it different from `Promise.allSettled()`?

 Both of them are used to consume multiple promises at the same time by implicitly return a new promise.

 The difference is that `Promise.all()` waits for all promises to resolve successfully.

- If every promise resolves, it resolves to an array of results.
- If any promise rejects, it immediately rejects with that error.

 While `Promise.allSettled()` waits until every promise has finished, regardless of whether it succeeded or failed. It always resolves to an array describing the outcome of each promise.

## 12. What is a callback function?

 A callback function is a function that is passed as an argument into another function, and is then executed inside that outer function.

## 13. Difference between 401 and 403 error code

 401 stands for Unauthorized. It means we are missing the authentication or the authentication is invalid.
 403 stands for Forbidden. It means we are authenticated but not having the authorization so that we are not allowed.

## 14. What does `response.json()` do when fetching an API?

 When `fetch()` resolves, it gives us a `Response` object where the body is actually a `ReadableStream`.

 Calling `response.json()` tells the browser to consume the ReadableStream and download data through it. Once the download finishes, the raw data first get decoded to a string, then parsed into a JavaScript object. Because both waiting for the network and parsing a large JSON string take time, `response.json()` is asynchronous and returns a Promise.

## 15. Describe the difference between a cookie, sessionStorage and localStorage in browsers

  localStorage and sessionStorage are storage used for browsers, essentially the front-end. localStorage is permanent, while sessionStorage is temporary and gets destroyed as the current browser tab is closed.

  Cookie also remembers state, but it is specifically for client-server communication. In most cases it contains server-side state, such as user authentication or session ID. localStorage and sessionStorage, however, don't interact with the backend.

## 16. What is the output of the following code?

    ```javascript
    (function (a) {
      return (function () {
        console.log(a);
        a = 23;
      })();
    })(45);
    ```

    It prints 45. The outter function is an IIFE; it is called with argument 45 and it runs immediately. It creates the inner function, which is also an IIFE, so the inner function is also executed. This inner function is also a closure so it remembers the variable `a` from outside, which has the value of 45, so the inner function prints 45. It then updates `a` to 23.
