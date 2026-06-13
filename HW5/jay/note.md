


1. What are the differences between call, apply & bind?

In JavaScript, call, apply, and bind all control what this points to inside a function.

call and apply invoke a function immediately with a specified this value. The difference is that call takes arguments individually, while apply takes arguments as an array. bind does not invoke the function immediately; it returns a new function with this fixed, and optionally with some arguments pre-filled.

```
function greet(greeting, punctuation) {
  console.log(greeting + ", " + this.name + punctuation);
}

const person = { name: "JJ" };
```

```
greet.call(person, "Hello", "!");
// Hello, JJ!
fn.call(thisArg, arg1, arg2, arg3)
```

```
greet.apply(person, ["Hello", "!"]);
// Hello, JJ!
fn.apply(thisArg, [arg1, arg2, arg3])
```

```
const greetJJ = greet.bind(person);
greetJJ("Hello", "!");
// Hello, JJ!

const newFn = fn.bind(thisArg, arg1, arg2)
```

2. Explain the this keyword in JavaScript.
// investigate sample code later. /
this topic is pretty complex.

this is a keyword that refers to the execution context of a function. Its value depends on how the function is called. In an object method, this refers to the object calling the method. With new, it refers to the newly created object. With call, apply, or bind, we can explicitly set this. Arrow functions are different because they do not have their own this; they inherit it from the surrounding lexical scope.

3. What does the event loop do? What data structures does it use?
// investigate sample code later. /
this topic is pretty complex.

The event loop coordinates execution between the call stack and async callback queues. JavaScript runs synchronous code on the call stack first. Async operations like timers, events, and network requests are handled by the browser or Node runtime. When their callbacks are ready, they are placed into queues. The event loop checks if the call stack is empty, then runs queued callbacks. It prioritizes the microtask queue, such as Promise callbacks, before the macrotask queue, such as setTimeout or DOM events.

4. What are closures?
// investigate sample code later. /
this topic is pretty complex.

A closure is when a function retains access to variables from its outer lexical scope, even after the outer function has returned. Closures are useful for private state, function factories, callbacks, and maintaining data across function calls. In JavaScript, functions remember the environment where they were created, not just where they are executed.

5. What is asynchronous code in JavaScript? How does JavaScript achieve asynchronous code?
// investigate sample code later. /
this topic is pretty complex.

Asynchronous code in JavaScript allows long-running tasks like timers, network requests, file reads, and user events to happen without blocking the main thread. JavaScript achieves this through the runtime environment, such as the browser or Node.js, which handles async operations outside the call stack. When the operation finishes, its callback is placed into a queue. The event loop checks when the call stack is empty and then pushes queued callbacks back onto the stack. Modern JavaScript commonly uses callbacks, Promises, and async/await to write asynchronous code.

6. What is async & await? How do we use them?
// investigate sample code later. /
this topic is pretty complex.

async and await are used to handle asynchronous JavaScript in a cleaner way. An async function always returns a Promise. Inside an async function, await pauses execution of that function until the Promise resolves or rejects. It makes Promise-based code easier to read compared to chaining .then(). Errors are usually handled with try/catch. await does not block the entire JavaScript thread; it only pauses the current async function while the event loop continues running other code.

7. How many HTTP methods are there? Explain each one.
// investigate sample code later. /
this topic is pretty complex.

The main HTTP methods are GET, POST, PUT, PATCH, and DELETE. GET retrieves data, POST creates or submits data, PUT replaces an entire resource, PATCH partially updates a resource, and DELETE removes a resource. Other methods include HEAD for headers only, OPTIONS for checking allowed methods or CORS preflight, TRACE for debugging, and CONNECT for creating tunnels through proxies.

   a. What is the difference between POST and PUT?

    POST is usually used to create a new resource or submit data to a server, often when the server generates the resource ID. PUT is used to replace an existing resource at a specific URL. The biggest difference is idempotency: sending the same POST multiple times may create multiple resources, while sending the same PUT multiple times should result in the same final state.

8. What is a Promise?
// investigate sample code later. /
this topic is pretty complex.

A Promise is an object that represents the eventual result of an asynchronous operation. It can be in one of three states: pending, fulfilled, or rejected. We use .then() to handle successful results, .catch() to handle errors, and .finally() to run cleanup code. Promises help avoid deeply nested callbacks and are the foundation for async/await in JavaScript.

# F
```
apply these to follow on questions.

// investigate sample code later. /
this topic is pretty complex.
```

9. What is promise chaining?

Promise chaining is a way to run asynchronous operations in sequence by returning values or Promises from .then() callbacks. Each .then() receives the result from the previous step. If a .then() returns a Promise, the next .then() waits for it to resolve. Errors can be handled with .catch() at the end of the chain.

10. Explain the three states of a Promise.

A Promise has three states: pending, fulfilled, and rejected. pending means the async operation is still in progress. fulfilled means it completed successfully and returned a value. rejected means it failed and returned an error or reason. A Promise starts as pending and can settle only once, either as fulfilled or rejected.

11. What is the use of Promise.all()? How is it different from Promise.allSettled?

Promise.all() runs multiple Promises in parallel and resolves when all of them resolve. It returns an array of resolved values in the same order as the input. If any Promise rejects, Promise.all() rejects immediately. Promise.allSettled() also runs multiple Promises and waits for all of them to finish, but it never fails fast. Instead, it returns an array of objects showing whether each Promise was fulfilled or rejected.

12. What is a callback function?

A callback function is a function passed as an argument to another function, and it is executed later. Callbacks are commonly used in array methods, event listeners, timers, and asynchronous operations. For example, in setTimeout(() => console.log("done"), 1000), the arrow function is a callback that runs after the timer finishes.

13. Difference between 401 and 403 error code.

401 Unauthorized means the request lacks valid authentication credentials, such as a missing, invalid, or expired token. 403 Forbidden means the user may be authenticated, but they do not have permission to access the requested resource. So 401 is an authentication problem, while 403 is an authorization problem.

14. What does `response.json()` do when fetching an API?

response.json() is a method on the Fetch API response object. It reads the response body and parses it from JSON text into a JavaScript object. Since reading the body is asynchronous, response.json() returns a Promise, so we usually use await response.json().

15. Describe the difference between a cookie, sessionStorage and localStorage in browsers.

Cookies are small pieces of data stored by the browser and automatically sent with HTTP requests to the server. They can have expiration dates and security flags like HttpOnly, Secure, and SameSite. sessionStorage stores data only for the lifetime of a single browser tab and is cleared when the tab closes. localStorage stores data persistently in the browser until it is manually cleared. Unlike cookies, sessionStorage and localStorage are not automatically sent to the server.

16. Explain the Event Loop in JavaScript.

The event loop is how JavaScript handles asynchronous operations. JavaScript runs synchronous code on the call stack first. Async tasks like timers, events, network requests, or file I/O are handled by the browser or Node.js runtime. When their callbacks are ready, they are placed into queues. The event loop checks whether the call stack is empty, then runs queued callbacks. Microtasks, such as Promise callbacks, have priority and are executed before macrotasks, such as setTimeout callbacks.

17. What is the output of the following code?

    ```js
    (function (a) {
      return (function () {
        console.log(a);
        a = 23;
      })();
    })(45);
    ```

The output is 45. The outer function is immediately invoked with the argument 45, so the parameter a is initialized to 45. Then the inner function is also immediately invoked, and because of closure, it still has access to the outer function’s variable a. Inside the inner function, console.log(a) runs before a is reassigned, so it prints 45. After that, a is changed to 23, but since there is no second console.log, the new value is never printed.