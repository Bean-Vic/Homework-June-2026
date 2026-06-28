## 1. What is an API? What problem does it solve between frontend and backend?

An API is a set of rules that lets the frontend and backend communicate with each other. For example, the frontend can call an API to get user data, submit a form, or update something in the database. It solves the problem of separation: the frontend does not need to know how the backend stores data, and the backend does not need to know how the UI is built. They just agree on the request format and response format.

## 2. What is JSON? What data types can JSON represent?'

JSON is a lightweight data format that is commonly used to send data between frontend and backend. It looks similar to JavaScript objects, but it is stricter. JSON can represent strings, numbers, booleans, null, arrays, and objects. It cannot directly represent undefined, functions, or comments. In real projects, I usually see API responses returned as JSON.

## 3. What are common JSON format mistakes?

Common mistakes include using single quotes instead of double quotes, adding trailing commas, writing comments inside JSON, or forgetting quotes around property names. Another mistake is trying to use undefined, because JSON does not support undefined. For example, `"name": undefined` is not valid JSON. I usually check JSON carefully because a small format issue can make the whole API response fail to parse.

## 4. What is RESTful API? What does "resource" mean in REST?

A RESTful API is an API style that organizes data as resources and uses HTTP methods to operate on them. A resource means the thing we are working with, like users, orders, products, or todos. For example, `/users` can represent a collection of users, and `/users/1` can represent one specific user. In REST, the URL describes the resource, and the HTTP method describes the action.

## 5. What is CRUD? How does CRUD map to HTTP methods?

CRUD means Create, Read, Update, and Delete. In HTTP, Create usually maps to POST, Read maps to GET, Update can map to PUT or PATCH, and Delete maps to DELETE. For example, creating a todo can be `POST /todos`, getting todos can be `GET /todos`, updating one todo can be `PATCH /todos/1`, and deleting it can be `DELETE /todos/1`. This mapping makes API design easier to understand.

## 6. What is the difference between POST, PUT, and PATCH?

POST is usually used to create a new resource, and the server decides the new id. PUT is usually used to replace the whole resource with a new version. PATCH is used to update only part of a resource. For example, if I only change a user's email, PATCH feels more suitable. If I send the entire user object to replace the old one, PUT makes more sense.

## 7. What does idempotent mean in HTTP? Which common methods are idempotent?

Idempotent means making the same request multiple times has the same final result as making it once. GET is idempotent because reading data does not change it. PUT is usually idempotent because replacing the same resource with the same data many times gives the same result. DELETE is also usually idempotent because after the resource is deleted, deleting it again does not change the final state. POST is usually not idempotent because sending it multiple times may create multiple records.

## 8. List common HTTP status codes in 2xx, 3xx, 4xx, and 5xx. When would you use each category?

2xx means success, like 200 OK or 201 Created. 3xx means redirect, for example 301 or 302 when the client needs to go to another URL. 4xx means the client side has a problem, like bad input, not logged in, or requesting something that does not exist. 5xx means the server has a problem, like the backend crashed or the database failed. In debugging, the status code gives me a quick idea of where to look first.

## 9. What is the difference between 400, 401, 403, and 404?

400 means Bad Request, usually the client sent invalid data or missing fields. 401 means Unauthorized, usually the user is not logged in or the token is missing/invalid. 403 means Forbidden, which means the user is logged in but does not have permission. 404 means Not Found, so the requested resource or route does not exist. I remember it like this: 401 is authentication, 403 is permission, and 404 is missing resource.

## 10. What is Node.js? Why is Node.js not a framework?

Node.js is a JavaScript runtime that allows JavaScript to run outside the browser, usually on the server side. It provides an environment to run JS and gives access to things like files, network, and operating system features. It is not a framework because it does not give a full application structure by itself. Frameworks like Express are built on top of Node.js to make web server development easier.

## 11. Why can Node.js handle many concurrent requests even though JavaScript runs on a single main thread?

Node.js can handle many requests because it uses non-blocking I/O and an event loop. The main JavaScript thread does not wait for slow tasks like file reading, database calls, or network requests. Those operations are handled in the background, and when they finish, Node puts the callback or promise result back into the event loop. So even though JS code runs on one main thread, Node can still manage many waiting tasks efficiently.

## 12. What is the Event Loop in Node.js?

The event loop is the mechanism that decides when asynchronous callbacks should run. Node first runs the synchronous code, then handles async tasks when they are ready. For example, a timer callback, a promise callback, or a file read callback will not run immediately during the main code execution. They wait until the call stack is clear and the event loop picks them up. This is why Node can do asynchronous work without blocking everything.

## 13. What is the execution order of synchronous code, process.nextTick, Promise.then, setTimeout, and setImmediate?

Synchronous code always runs first. After the synchronous code finishes, `process.nextTick` usually runs before Promise microtasks in Node.js. Then `Promise.then` callbacks run. After that, timer callbacks like `setTimeout` can run, and `setImmediate` runs in a later event loop phase. In practice, I remember it as: sync first, then microtasks, then timers and other event loop callbacks.

## 14. What kinds of operations can block the Node.js event loop?

CPU-heavy operations can block the event loop, like large loops, heavy calculations, image processing, or parsing a huge JSON file. Synchronous APIs can also block it, like `fs.readFileSync()` if the file is large. When the event loop is blocked, the server cannot respond to other requests quickly. So in backend code, I try to avoid long synchronous work on the main thread.

## 15. What is the difference between CommonJS and ES Modules?

CommonJS uses `require()` and `module.exports`, and it has been used in Node.js for a long time. ES Modules use `import` and `export`, which is the modern JavaScript module syntax. CommonJS loads modules in a more synchronous style, while ES Modules are designed to work better with modern tooling and static analysis. In real projects, I just follow the project setup, but I try not to mix the two styles unless necessary.

## 16. What are fs, path, and http core modules used for?

`fs` is used to work with the file system, like reading or writing files. `path` is used to handle file paths safely across different operating systems. `http` is used to create basic HTTP servers and handle requests and responses. In real projects, Express is often used instead of directly using `http`, but Express still runs on top of Node's HTTP module.

## 17. What is the difference between callback, Promise, and async/await?

A callback is a function passed into another function and called later when the work is done. A Promise represents a future result, and it can be handled with `.then()` and `.catch()`. `async/await` is a cleaner syntax for working with Promises, making async code look more like normal step-by-step code. I prefer async/await because it is easier to read, especially when there are multiple async operations.

## 18. What is unhandledRejection? Why should backend services handle it?

`unhandledRejection` happens when a Promise is rejected but there is no `.catch()` or try/catch to handle the error. In backend services, this is dangerous because the error may be hidden or may crash the process depending on the setup. It can also make debugging harder. I think backend code should handle rejected Promises clearly, log the error, and return a proper response instead of letting the app fail silently.

## 19. What is Express? What problem does it solve on top of Node's http module?

Express is a web framework for Node.js. It makes it easier to build APIs and web servers. Node's built-in `http` module is powerful, but it is low-level and requires more manual work for routing, request parsing, and middleware. Express gives us cleaner route handling like `app.get()`, `app.post()`, and middleware support. So it helps developers build backend services faster and with less repeated code.

## 20. What is Express middleware? What happens if a middleware does not call next() or send a response?

Express middleware is a function that runs between the request and the final response. It can do things like logging, authentication, parsing JSON, or checking permissions. If a middleware does not call `next()` and also does not send a response, the request will hang. The client will keep waiting because Express does not know how to continue. So every middleware should either pass control with `next()` or finish the response.

## 21. What is the difference between req.params, req.query, and req.body?

`req.params` comes from dynamic parts of the URL path, like `/users/:id`, so `id` is in `req.params`. `req.query` comes from the query string after `?`, like `/users?role=admin`. `req.body` comes from the request body, usually used in POST, PUT, or PATCH when the client sends JSON data. I usually use params for identifying a resource, query for filters or search options, and body for data the client wants to create or update.

## 22. How does Express handle errors? Why must error middleware have 4 parameters?

Express handles errors by passing them to error-handling middleware. We can pass an error using `next(error)`, or catch errors in async routes and send them to the error handler. Error middleware must have 4 parameters: `err`, `req`, `res`, and `next`. Express uses this function signature to recognize it as an error handler. Without the 4 parameters, Express may treat it as normal middleware instead of error middleware.
