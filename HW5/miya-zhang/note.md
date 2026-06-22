## 1. What are the differences between call, apply, and bind?

All three methods are basically used to manually set the this context of a function. The easiest way to think about it is grouping call and apply together, and looking at bind separately. Both call and apply execute the function immediately. The only difference between them is how you pass the arguments: call takes them comma-separated, while apply takes an array—I always remember 'A' is for Array, and 'C' is for Comma.
bind, on the other hand, doesn't run the function right away. Instead, it returns a brand new function with that this context permanently locked in, which we use a lot when passing callbacks.

## 2. Explain the this keyword in JavaScript.

this refers to the object that is calling the function. Its value depends on how the function is called.
For example, inside an object method, this usually refers to that object. But in arrow functions, this comes from the surrounding scope.
I think of this as a dynamic reference, and I always check the calling context.

## 3. Explain the Event Loop in JavaScript.

The event loop is how JavaScript handles asynchronous tasks. JavaScript is single-threaded, so it runs synchronous code first. When async tasks finish, their callbacks go into queues. The event loop checks if the call stack is empty, and then moves waiting tasks into the stack.
The event loop helps JavaScript run async code without blocking the main thread.

## 4. What are closures?

A closure happens when an inner function can still access variables from its outer function, even after the outer function has finished running. If a function returns another function, the inner function can remember the outer variables. Closures are useful for private data and keeping state.
I understand closure as a function that remembers its outer scope.

## 5. What is asynchronous code in JavaScript? How does JavaScript achieve asynchronous code?

Because JavaScript is single-threaded, it can only do one thing at a time. If we had a heavy task, like fetching data from an API, a synchronous approach would completely freeze the webpage. Asynchronous code solves this by being non-blocking. JavaScript basically hands off these slow tasks to the browser's Web APIs to process in the background, and moves on to the next line of code. When the background task finishes, the Event Loop pushes the result back to the main thread. Nowadays, we usually handle this cleanly using Promises or async/await syntax.

## 6. What is async and await? How do we use them?

async and await are used to work with promises in a cleaner way. An async function always returns a promise.
Inside an async function, we can use await to wait for a promise to finish before moving to the next line.
So async and await make asynchronous code look more like normal synchronous code.

## 7. How many HTTP methods are there? Explain each one. What is the difference between POST and PUT?

There are several common HTTP methods, like GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS. GET is used to read data. POST is used to create data. PUT is usually used to replace or update a whole resource. PATCH updates part of a resource. DELETE removes data. The difference between POST and PUT is that POST usually creates a new resource, while PUT updates or replaces an existing resource.
Then I would use POST for creating, and PUT for full updates.

## 8. What is a Promise?

A Promise is an object that represents a future result of an asynchronous operation. It can succeed or fail later.
When we fetch data from an API, the result may not come back immediately, so we use a promise to handle it.
So a promise helps us manage async results in JavaScript.

## 9. What is promise chaining?

Promise chaining means using multiple .then() calls one after another. Each .then() can return a value or another promise, and the next .then() receives that result. It helps us run async steps in order.
So promise chaining is a way to organize async logic step by step.

## 10. Explain the three states of a Promise.

A Promise is basically a placeholder for a value we don't have yet. It always starts out as pending while the task is running in the background. Once the task finishes, the Promise settles into one of two final states: fulfilled if everything went perfectly, or rejected if something failed.

## 11. What is the use of Promise.all? How is it different from Promise.allSettled?

Promise.all runs multiple promises at the same time and waits for all of them to succeed. If one promise fails, Promise.all fails immediately. Promise.allSettled also waits for all promises, but it does not stop when one fails. It returns the result of every promise, whether it succeeded or failed.
So I use Promise.all when all tasks must succeed, and Promise.allSettled when I want every result.

## 12. What is a callback function?

A callback function is a function passed into another function as an argument. The other function can call it later. When a button is clicked, we can run a callback function. A callback is basically a function we give to another function to run later.

## 13. Difference between 401 and 403 error code.

401 means unauthorized. The user is not authenticated, or the login token is missing or invalid.
403 means forbidden. The user is authenticated, but does not have permission to access the resource.
So 401 is more about “who are you,” and 403 is more about “you are not allowed.”

## 14. What does response.json() do when fetching an API?

response.json() reads the response body and converts it into a JavaScript object.
It returns a promise, so we usually need to use await or .then().
After fetching an API, we can use await response.json() to get the actual data.
response.json() helps us parse JSON data from an API response.

## 15. Describe the difference between a cookie, sessionStorage and localStorage in browsers.

Cookies, sessionStorage, and localStorage all store data in the browser, but they are different. Cookies can be sent to the server with requests, and they are often used for authentication or tracking. sessionStorage stores data only for the current browser tab. When the tab is closed, the data is gone.
localStorage stores data with no automatic expiration, so it stays even after the browser is closed.
Cookies are often for server-related data, sessionStorage is temporary, and localStorage is more persistent.

## 16. What is the output of the following code?

The output is 45. This snippet is basically testing closures and the scope chain. The outer IIFE is called with 45, so the parameter a is 45 in that closure. When the inner function runs, it looks for a, doesn't find it locally, and goes up the scope chain to grab the outer a, logging 45. The a = 23 line does reassign the value, but since it happens after the log, it doesn't affect the output.
