1. What are the differences between call, apply & bind?
All three set the this context of a function. call invokes it immediately with arguments passed individually. apply is the same, but it takes arguments as an array. bind doesn't invoke — it returns a new function with this permanently bound, which we can call later.

2. Explain the this keyword in JavaScript.
This refers to the execution context of a function — basically, who's calling it. In a regular function it depends on how it's called: in a method, it's the object; standalone, it's the global object or undefined in strict mode. Arrow functions are different — they inherit this from the enclosing scope.

3. Explain the Event Loop in JavaScript.
JavaScript is single-threaded, so the event loop is how it handles async work. It checks if the call stack is empty, then pulls tasks from the queue and pushes them onto the stack. Microtasks like promise callbacks have priority over macrotasks like setTimeout. That's why a resolved promise runs before a setTimeout(fn, 0).

4. What are closures?
A closure is when a function remembers the variables from the scope where it was created, even after that outer function has returned. It's how we create private state in JavaScript — for example, a counter function that holds onto its count between calls. Closures are everywhere — event handlers, callbacks, module patterns.

5. What is asynchronous code in JavaScript? How does JavaScript achieve asynchronous code?
Async code is code that doesn't block the main thread — it runs in the background and we get notified when it's done. JavaScript itself is single-threaded, but the browser or Node provides Web APIs like setTimeout, fetch, and I/O. These offload the work, and the event loop schedules the callbacks via promises, callbacks, or async/await.

6. What is async & await? How do we use them?
Async and await are syntactic sugar over promises that lets us write async code that reads like synchronous code. We mark a function with async, and inside it we use await to pause until a promise resolves. We usually wrap awaits in try/catch to handle errors cleanly.

7. How many HTTP methods are there? Explain each one.
The main ones are: GET for reading data, POST for creating, PUT for replacing a whole resource, PATCH for partial updates, and DELETE for removing. There's also HEAD and OPTIONS, which are used for metadata and CORS preflight.
a. What's the difference between POST and PUT?
POST creates a new resource — the server usually assigns the ID, and it's not idempotent, so calling it twice creates two resources. PUT replaces a resource at a known URL — it is idempotent, so calling it multiple times has the same effect as calling it once.

8. What is a Promise?
A Promise is an object representing the eventual result of an async operation — either a success or a failure. It has a .then for success, .catch for errors, and .finally for cleanup. Promises replaced the old callback pattern and made async code much easier to reason about.

9. What is promise chaining?
Promise chaining is when we link multiple .then calls in sequence, where each one runs after the previous resolves. Whatever we return from one then gets passed to the next. It lets us flatten what would otherwise be deeply nested callbacks — the so-called callback hell.

10. Explain the three states of a Promise.
A promise is in one of three states: pending — the initial state, still working; fulfilled — resolved successfully with a value; or rejected — failed with a reason. Once it settles into fulfilled or rejected, it can't change — promises are immutable in that sense.

11. What is the use of Promise.all? How is it different from Promise.allSettled?
Promise.all runs multiple promises in parallel and resolves when all of them succeed — but if any one fails, the whole thing rejects immediately. Promise.allSettled waits for every promise to finish regardless of outcome, and returns an array of results with status and value or reason. So all is fail-fast, allSettled is patient.

12. What is a callback function?
A callback is a function we pass as an argument to another function, to be called later. It's the foundation of async JavaScript before promises came along — think setTimeout, event handlers, or array methods like map and forEach.

13. Difference between 401 and 403 error code.
401 Unauthorized means we're not authenticated — the server doesn't know who we are, so we need to log in. 403 Forbidden means the server knows who we are, but we don't have permission to access this resource. So 401 is "who are you", 403 is "you can't have this".

14. What does `response.json()` do when fetching an API?
response.json() reads the response body and parses it as JSON. It returns a promise, because reading the body is async — so we either chain a .then or await it. That's why we typically write const data = await response.json().

15. Describe the difference between a cookie, sessionStorage and localStorage in browsers.
Cookies are small, around 4KB, and get sent with every HTTP request — that's why they're used for auth. localStorage holds about 5–10MB and persists until we explicitly clear it. sessionStorage is the same size but clears when the tab closes. Storage APIs stay client-side; cookies travel to the server.

16. What is the output of the following code?
js(function (a) {
  return (function () {
    console.log(a);
    a = 23;
  })();
})(45);

The output is 45. The outer IIFE is called with 45, so a is 45 in that scope. The inner IIFE is a closure — it doesn't have its own a, so it looks up the outer one and logs 45 before reassigning it to 23. The reassignment happens after the log, so it doesn't affect the output.
