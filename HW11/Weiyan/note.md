# HW11: JavaScript Backend Fundamentals Part 1 - API, Node, Express

## 1. What is an API? What problem does it solve between frontend and backend?

 API stands for Application Programming Interface. It is a set of rules and protocols that allows one piece of software to communicate with another. In web development, it acts as the messenger that takes a request from the frontend, delivers it to the backend, and then brings back the backend's response.

 API achieves the Separation of Concerns between the front- and backend. With API, the front and backend can exchange data effortlessly even when using different languages, and the frontend doesn't have to know about the database structure, and the backend doesn't need to know about the UI.

## 2. What is JSON? What data types can JSON represent?

 JSON stands for JavaScript Object Notation. It is the standard data format used by modern Web APIs.

 JSON can represent Strings, Numbers, Booleans, Null, Objects, and Arrays, but it can't represent functions. (Because JSON is just a text representation of data, it cannot hold executable code.)

## 3. What are common JSON format mistakes?

 I think the No.1 common mistake is probably forgetting to double quote the keys. And we should always use double quotes instead of single quotes in JSON for keys and strings.

 Another common mistake is having a trailing comma in objects or arrays. JSON cannot parse trailing commas.

 And it is also incorrect to include a comment in JSON. In JSON there is no place for comments (though you can workaround).

 And you cannot have `undefined` or `NaN` in JSON.

## 4. What is RESTful API? What does "resource" mean in REST?

 REST stands for Representational State Transfer. It is a set of designing rules that organize data into distinct resources, and allow programs to manipulate them using standard HTTP methods over a stateless connection. So a RESTful API is an API that follows the REST rules.

 A resource refers to any object that the REST API manages so that you can manipulate with HTTP methods. It can be either a collection of items or an individual instance.

## 5. What is CRUD? How does CRUD map to HTTP methods?

 CRUD stands for Create, Read, Update, and Delete. They are the operations you can apply to resources with REST APIs, or generally speaking the operations you can perform on any data or database.

 Create maps to POST; Read maps to GET; Update maps to PUT or PATCH; and Delete maps to DELETE.

## 6. What is the difference between POST, PUT, and PATCH?

 POST is used to create a new subordinate resource. It targets a collection URL, (like `/users`,) and creates a new record of data, or a new instance, that belongs to the collection.

 PUT, on the other hand, targets a specific item's URL (like `/users/001`). It replaces all the current data of the specific item with its payload.

 PATCH also targets a specific item's URL, but it is used to update specific fields without touching the rest of the data.

## 7. What does idempotent mean in HTTP? Which common methods are idempotent?

 Idempotent means, for an HTTP method, making request for multiple times leaves the server in the same state as making the request once.

 GET, PUT, and DELETE are idempotent. POST is not idempotent. PATCH, strictly speaking, I think it is not idempotent.

## 8. List common HTTP status codes in 2xx, 3xx, 4xx, and 5xx. When would you use each category?

- 200s means Success. For example, 200 means OK, 201 is Created, and 204 means No Content, or essentially deleted.
- 300s means Redirection. For example, 302 means you are redirected to another URL temporarily.
- 400s means client error. 400 is Bad Request; 401 is Unauthorized. 403 id Forbidden. And 404 is Not Found.
- Then 500s are for Server Errors. 500 means Internal Server Error. It basically means the Node.js or Express crashed. 502 is Bad Gateway.

## 9. What is the difference between 400, 401, 403, and 404?

- 400 is Bad Request; it means the client sent invalid request so server cannot process it.
- 401 is Unauthorized. But it actually means not authenticated, aka not logged in or not having valid token to access.
- 403 is Forbidden. It means the client is authenticated, it is logged in, but doesn't have the permissions to perform the action.
- And 404 is Not Found. It means the requested URL or resource does not exist on the server.

## 10. What is Node.js? Why is Node.js not a framework?

 Node.js is a runtime environment for JavaScript so that JavaScript can be executed on the server side.

 It is not a framework because it doesn't define the architecture of the application. It doesn't have the Inversion of Control; it provides the engine and a few core modules to run JavaScript, but it doesn't offer a structure for your application.

## 11. Why can Node.js handle many concurrent requests even though JavaScript runs on a single main thread?

 Node.js can handle many concurrent requests on a single main thread because of its Non-blocking I/O architecture together with the Event Loop.

 In Node.js, the single thread only executes the fast, synchronous code, and when an asynchronous operation comes in, the main thread offloads it to the underlying system and moves on to the next request. Once the background task finishes, its callback is pushed into the Event Loop's queue. The Event Loop will then pick up the callback and execute it on the main thread when it is free.

## 12. What is the Event Loop in Node.js?

 In Node.js, the Event Loop is the mechanism that manages the execution of asynchronous callbacks, allowing the single thread to handle concurrent requests seamlessly. When an async task occurs, Node.js offloads it to the underlying system.

 Once the operation completes, its callback is pushed into a queue. The Event Loop manages these queues by visiting different phases and executing the queued callbacks sequentially.

## 13. What is the execution order of synchronous code, `process.nextTick`, `Promise.then`, `setTimeout`, and `setImmediate`?

 Synchronous code is always executed first. Then comes the Microtask Queue, where `process.nextTick` has a higher priority than Promises. So after the synchronous code is `process.nextTick`, followed by `Promise.then`.

 The phases of Event Loop have a lower priority than the Microtasks, while the Timers phase is the first phase, so `setTimeout` will be executed. And later in the loop, `setImmediate` will be run.

## 14. What kinds of operations can block the Node.js event loop?

 First of all, only synchronous operations, rather than asynchronous operations have the potential to block the event loop.

 A major part of them are the synchronous version of I/O operations. For example, a `readFileSync`, that is a synchronous file reading; or a synchronous cryptography. They might take the main thread for a long time.

 Another situation is, if you are using ORM or ODM, like Sequelize or Mongoose, the hydration and the in-memory joins will consume massive RAM space and severely block the main thread.

## 15. What is the difference between CommonJS and ES Modules?

 CommonJS and ES Modules are two different set of Module System that defines how to import code between JS files.

 Obviously they have different syntax: we use `require()` and `module.exports` in CommonJS, while using `import` and `export` in ES Modules.

- CommonJS is synchronous and loaded dynamically at runtime. You can write a `require()` inline so that it runs conditionally.
- ESM is asynchronous, and statically analyzed at compile-time. All imports must be written at the top a file to enable the static import.

 And CommonJS is for Node.js only while ESM is more universal.

## 16. What are `fs`, `path`, and `http` core modules used for?

- `fs` is used to interact with the server's file system. It provides methods for reading, writing, updating the local files. It provides both synchronous (e.g., `readFileSync`) and asynchronous (e.g., `readFile`) methods.
- `path` is the module for manipulating and resolving paths. It automatically handles the difference across various operating systems.
- `http` is the module for creating web servers and handling HTTP requests and responses. It allows Node.js to transfer data over HTTP.

## 17. What is the difference between callback, Promise, and async/await?

 Callbacks, Promises, and Async/Await are ways to write async code. It starts with the idea of callback.

 A callback is a function that you pass as an argument to another function, with the understanding that it will be executed later once the background task is done. Using the syntax of callback, if you need to perform several asynchronous tasks in a row, you have to nest callbacks inside of callbacks, which is prone to mistakes and you have to manually catch errors at every single level.

 Then JavaScript introduced Promises. A Promise is an object that represents the eventual completion or failure of an asynchronous operation. So instead of passing a function as an argument to another function, we can use `then()` to chain up a series of async operations, and append a single `catch()` at the very bottom of the chain for error handling.

 And finally, async/await is essentially another way to write the Promise chaining. The difference is that it resolves the Promise under the hood for you, so that the code looks much more like synchronous code, and you can use the standard `try/catch` blocks for error handling.

## 18. What is `unhandledRejection`? Why should backend services handle it?

 `unhandledRejection` is a global event raised by the Node.js process when a Promise is rejected, but no error handler was there to handle it.

 It should be explicitly handled in backend services, because if the `unhandledRejection` is left ignored, Node.js will crash itself immediately without logging (to prevent even more unwanted situation). So in comparison, it is much more preferrable to handle it explicitly so that you can log the error and shutdown gracefully.

## 19. What is Express? What problem does it solve on top of Node.js' `http` module?

 Express is a web application framework built on top of Node.js.

 In terms of the `http` module, Express provides a nice encapsulation of the Node.js `http` module, and it solves the problem of the cumbersome request routing. (Because) in native Node.js, we have to write `if/else` statements to differentiate various URLs and HTTP methods for incoming requests, while Express provides a routing API that maps the HTTP methods plus the URL to the callback function so that you write the code for handling HTTP requests in a more concise and declarative way.

 Another problem that Express solves is about parsing data. In native Node.js, receiving incoming POST data (like JSON or form submissions) requires manually listening to data streams and concatenating chunks. But Express with middleware, like `express.json()` solves this instantly.

## 20. What is Express middleware? What happens if a middleware does not call `next()` or send a response?

 Express middleware is a function that intercepts incoming HTTP requests to perform background tasks (such as logging or parsing data), or modifies the request/response objects, and decides either to terminate the request-response cycle or to pass the control to the next middleware in the pipeline.

 If a middleware does not call `next()` or send a response, the request becomes a 'hanging request', the middleware pipeline halts, and the client is left waiting until the connection times out. And the client will not receive a response.

## 21. What is the difference between `req.params`, `req.query`, and `req.body`?

- `req.params` contains the route parameters. It captures the variables (or placeholders) defined within a dynamic URL path.
- `req.query` contains the query strings. It captures the key-value pairs that come after the question mark in the URL.
- `req.body` contains the data payload sent within the request body. More specifically, it refers to the parsed request body, which is a JavaScript object rather than a JSON string.

## 22. How does Express handle errors? Why must error middleware have 4 parameters?

 In a regular route or middleware, if an error occurs, you can pass the error object to the `next` function (`next(err)`). This immediately bypasses all remaining regular middleware, and the request is routed directly to the Error-Handling Middleware, which must be defined at the very end of the application stack.

 The Error-Handling Middleware must have 4 arguments (`(err, req, res, next)`) because it is how Express identifies this middleware. This function is then responsible for logging the error and sending a failure response to the client.
