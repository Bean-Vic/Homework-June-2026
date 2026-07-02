
## 1. 问答练习（八股）

准备以下题目的答案，写在 `note.md` 里。每题建议 3-6 句话，重点解释概念、使用场景和常见坑。

```
1. What is an API? What problem does it solve between frontend and backend?

An API, or Application Programming Interface, is a set of rules that allows different software systems to communicate with each other. In web development, the frontend uses APIs to request data or send data to the backend. The backend exposes endpoints, and the frontend calls those endpoints instead of directly accessing the database. This solves the problem of separation: the frontend focuses on UI, while the backend handles business logic, database access, authentication, and security.

2. What is JSON? What data types can JSON represent?

JSON stands for JavaScript Object Notation. It is a lightweight data format commonly used to send data between frontend and backend. JSON can represent strings, numbers, booleans, null, arrays, and objects.

3. What are common JSON format mistakes?

Common JSON mistakes include using single quotes instead of double quotes, leaving trailing commas, and forgetting quotes around object keys. Another mistake is trying to use unsupported values like undefined, functions, or comments inside JSON. JSON also requires proper nesting with matching braces and brackets.

4. What is RESTful API? What does "resource" mean in REST?

A RESTful API is an API design style that organizes data around resources and uses HTTP methods to perform actions on those resources. A resource is usually a noun, such as users, posts, orders, or products. Each resource is identified by a URL, such as /users/123. REST focuses on what resource the client wants to operate on, rather than naming endpoints like functions.

5. What is CRUD? How does CRUD map to HTTP methods?

CRUD stands for Create, Read, Update, and Delete. These are the four basic operations most applications perform on data. In REST APIs, Create usually maps to POST, Read maps to GET, Update maps to PUT or PATCH, and Delete maps to DELETE.

6. What is the difference between POST, PUT, and PATCH?

POST is usually used to create a new resource or trigger an action. PUT is usually used to replace an entire resource with a new version. PATCH is used to partially update a resource. For example, if a user has name, email, and age, a PUT request may send all fields, while a PATCH request may only send { "email": "new@example.com" }.

7. What does idempotent mean in HTTP? Which common methods are idempotent?

Idempotent means that making the same request multiple times has the same final effect as making it once. For example, deleting the same resource multiple times should still result in the resource being deleted. Common idempotent HTTP methods include GET, PUT, DELETE, HEAD, and OPTIONS. POST is usually not idempotent because calling it multiple times may create multiple resources. PATCH may or may not be idempotent depending on how the API is designed.

8. List common HTTP status codes in 2xx, 3xx, 4xx, and 5xx. When would you use each category?

2xx status codes mean success, such as 200 OK, 201 Created, and 204 No Content. 3xx status codes mean redirection, such as 301 Moved Permanently and 302 Found. 4xx status codes mean the client made a bad request, such as 400 Bad Request, 401 Unauthorized, 403 Forbidden, and 404 Not Found. 5xx status codes mean the server failed, such as 500 Internal Server Error or 503 Service Unavailable. In general, use 4xx when the frontend/client sent something wrong, and use 5xx when the backend/server broke.

9. What is the difference between 400, 401, 403, and 404?

400 Bad Request means the request is invalid, usually because of missing fields, wrong data format, or validation errors. 401 Unauthorized means the user is not authenticated, such as missing or invalid login token. 403 Forbidden means the user is authenticated but does not have permission to access the resource. 404 Not Found means the requested resource or route does not exist.

10. What is Node.js? Why is Node.js not a framework?

Node.js is a JavaScript runtime that allows JavaScript to run outside the browser. It is commonly used to build backend servers, command-line tools, scripts, and APIs. Node.js is not a framework because it does not provide a complete application structure by itself. Instead, it provides a runtime environment and core modules like fs, http, and path. Frameworks like Express are built on top of Node.js to make backend development easier.

11. Why can Node.js handle many concurrent requests even though JavaScript runs on a single main thread?

Node.js can handle many concurrent requests because it uses non-blocking I/O and an event-driven architecture. The JavaScript code runs on a single main thread, but slow operations like file system access, network requests, and database calls can be handled asynchronously. While waiting for those operations to finish, Node.js can continue processing other requests. Some work is also handled by the libuv thread pool or the operating system. This makes Node.js efficient for I/O-heavy applications, but not ideal for CPU-heavy work on the main thread.

12. What is the Event Loop in Node.js?

The Event Loop is the mechanism that allows Node.js to handle asynchronous operations without blocking the main thread. It continuously checks whether the call stack is empty and then runs queued callbacks when their async operations are ready.

13. What is the execution order of synchronous code, process.nextTick, Promise.then, setTimeout, and setImmediate?

Synchronous code always runs first because it is executed directly on the call stack. After synchronous code finishes, process.nextTick callbacks usually run before Promise microtasks in Node.js. Then Promise.then callbacks run. After that, timer callbacks like setTimeout may run, and setImmediate usually runs in the check phase of the event loop.

14. What kinds of operations can block the Node.js event loop?

CPU-heavy operations can block the Node.js event loop, such as large loops, complex calculations, image/video processing, encryption, or parsing huge JSON files. Synchronous APIs can also block the event loop, such as fs.readFileSync or other sync file operations.

15. What is the difference between CommonJS and ES Modules?

CommonJS and ES Modules are two module systems used in JavaScript. CommonJS uses require() to import and module.exports to export. ES Modules use import and export syntax. CommonJS was traditionally used in Node.js, while ES Modules are the official JavaScript standard and are widely used in modern frontend and backend code.

16. What are fs, path, and http core modules used for?

fs is the file system module used to read, write, update, and delete files. path is used to safely work with file and directory paths across different operating systems. http is used to create basic HTTP servers and handle requests and responses.

17. What is the difference between callback, Promise, and async/await?

A callback is a function passed into another function to run later, often after an async operation finishes. A Promise represents a future value and allows chaining with .then() and .catch(). async/await is syntax built on top of Promises that makes asynchronous code look more like synchronous code.

18. What is unhandledRejection? Why should backend services handle it?

unhandledRejection happens when a Promise is rejected but there is no .catch() or try/catch handling it. In backend services, this is dangerous because it may hide bugs, cause inconsistent behavior, or crash the process depending on configuration. For example, a failed database call without proper error handling could create an unhandled rejection. Backend services should log these errors and handle them properly so the system is easier to debug and more reliable.

19. What is Express? What problem does it solve on top of Node's http module?

Express is a minimal web framework for Node.js. It makes it easier to build APIs and web servers compared to using Node’s built-in http module directly. Express provides routing, middleware, request parsing, response helpers, and error handling patterns. Without Express, developers would need to manually parse URLs, handle methods, and organize routes. Express solves these problems by giving a cleaner structure for backend applications.

20. What is Express middleware? What happens if a middleware does not call next() or send a response?

Express middleware is a function that runs during the request-response cycle. It can read or modify the request, run authentication, parse JSON, log requests, or handle errors. Middleware usually receives req, res, and next. If a middleware does not call next() and does not send a response, the request will hang because Express does not know how to continue. This is a common bug when writing custom middleware.

21. What is the difference between req.params, req.query, and req.body?

req.params contains route parameters from the URL path, such as /users/:id, where id is stored in req.params.id. req.query contains query string values after the ?, such as /users?page=2, where page is stored in req.query.page. req.body contains data sent in the request body, usually from POST, PUT, or PATCH requests.

22. How does Express handle errors? Why must error middleware have 4 parameters?

Express handles errors by passing them to error-handling middleware. Normal middleware usually has three parameters: req, res, and next. Error middleware must have four parameters: err, req, res, and next. Express uses the four-parameter function signature to recognize that it is an error handler.

```

⼩组间Peer Mock，录⾳并上传