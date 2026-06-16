

1. **What are the differences between call, apply & bind?**  
   `call`, `apply`, and `bind` all set `this`, but `call` runs the function with arguments one by one, `apply` runs it with an array of arguments, and `bind` returns a new function to run later.

2. **Explain the this keyword in JavaScript.**  
   In JavaScript, `this` means the object that is calling the function, and its value depends on how the function is invoked.

3. **Explain the Event Loop in JavaScript.**  
   The event loop lets JavaScript run async work by moving finished tasks from queues back onto the call stack when the stack is empty.

4. **What are closures?**  
   A closure is when an inner function remembers variables from its outer function even after the outer function has finished.

5. **What is asynchronous code in JavaScript? How does JavaScript achieve asynchronous code?**  
   Asynchronous code is code that does not block the main thread, and JavaScript handles it with callbacks, promises, async/await, browser APIs, and the event loop.

6. **What is async & await? How do we use them?**  
   `async` and `await` let us write promise-based code in a cleaner style, where `await` pauses inside an `async` function until the promise settles.

7. **How many HTTP methods are there? Explain each one. What is the difference between POST and PUT?**  
   Common HTTP methods are `GET` to read, `POST` to create or submit, `PUT` to replace, `PATCH` to partially update, `DELETE` to remove, `HEAD` to get headers, and `OPTIONS` to check supported actions; `POST` is usually for creating or submitting data, while `PUT` is for idempotently replacing a resource.

8. **What is a Promise?**  
   A Promise is an object that represents a value we may get later, either successfully or with an error.

9. **What is promise chaining?**  
   Promise chaining means returning promises from `.then()` calls so each async step runs after the previous one finishes.

10. **Explain the three states of a Promise.**  
    A Promise has three states: `pending` while waiting, `fulfilled` when it succeeds, and `rejected` when it fails.

11. **What is the use of Promise.all? How is it different from Promise.allSettled?**  
    `Promise.all` waits for all promises but fails fast on the first rejection, while `Promise.allSettled` waits for everything and gives each result whether it succeeded or failed.

12. **What is a callback function?**  
    A callback function is a function passed into another function so it can be called later.

13. **Difference between 401 and 403 error code.**  
    A `401` means the user is not authenticated, while a `403` means the user is authenticated but not allowed to access that resource.

14. **What does `response.json()` do when fetching an API?**  
    `response.json()` reads the response body and parses it into a JavaScript object or array.

15. **Describe the difference between a cookie, sessionStorage and localStorage in browsers.**  
    Cookies are small pieces of data sent with HTTP requests, while `sessionStorage` lasts for one browser tab session and `localStorage` stays saved until we clear it.

16. **What is the output of the following code?**

    ```js
    (function (a) {
      return (function () {
        console.log(a);
        a = 23;
      })();
    })(45);
    ```

    The output is `45`, because the inner function closes over `a`, logs it first, and only then changes it to `23`.
