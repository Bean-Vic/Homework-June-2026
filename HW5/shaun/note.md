1. What are the diﬀerences between call, apply & bind?
   call() invokes a function with arguments passed individually, apply() invokes it with arguments as an array, and bind() returns a new function with a fixed this value.
2. Explain the this keyword in JavaScript.
   this refers to the object that is currently executing the function.
3. Explain the Event Loop in JavaScript.
   The Event Loop continuously checks the call stack and task queue, executing queued tasks when the stack becomes empty.
4. What are closures?
   A closure is a function that can access variables from its outer scope even after the outer function has returned.
5. What is asynchronous code in JavaScript? How does JavaScript achieve asynchronous code?
   Asynchronous code allows tasks to run without blocking execution and is achieved through APIs, callbacks, promises, and the Event Loop.
6. What is async & await? How do we use them?
   async and await provide a cleaner way to write asynchronous code by making Promise-based code look synchronous.
7. How many HTTP methods are there? Explain each one.
   Common HTTP methods are GET (read), POST (create), PUT (replace), PATCH (update), DELETE (remove), HEAD (headers only), and OPTIONS (supported methods).
   a. What is the diﬀerence between POST and PUT?
   POST creates a new resource, while PUT creates or completely replaces an existing resource.
8. What is a Promise?
   A Promise is an object that represents the eventual success or failure of an asynchronous operation.
9. What is promise chaining?
   Promise chaining uses multiple .then() calls to execute asynchronous operations sequentially.
10. Explain the three states of a Promise.
    A Promise can be in one of three states: pending, fulfilled, or rejected.
11. What is the use of Promise.all? How is it different from Promise.allSettled?‘
    Promise.all() fails immediately if any promise rejects, while Promise.allSettled() waits for all promises to finish regardless of outcome.
12. What is a callback function?
    A callback function is a function passed into another function to be executed later.
13. Difference between 401 and 403 error code.
    401 Unauthorized means authentication is required, while 403 Forbidden means authentication succeeded but access is denied.
14. What does `response.json()` do when fetching an API?
    response.json() parses the response body and converts it into a JavaScript object.
15. Describe the difference between a cookie, sessionStorage and localStorage in browsers.
    Cookies are sent to the server with requests, sessionStorage lasts for a browser tab session, and localStorage persists until manually cleared.
16. What is the output of the following code?
    `    (function (a) {
  return (function () {
    console.log(a);
    a = 23;
  })();
})(45);`
    The output is 45 because the inner function forms a closure and accesses the value of a before it is reassigned.
