1. What is an API? What problem does it solve between frontend and backend?
   An API defines how the frontend and backend communicate by exchanging requests and responses.
2. What is JSON? What data types can JSON represent?
   JSON is a lightweight data format that supports strings, numbers, booleans, objects, arrays, null, and nested structures.
3. What are common JSON format mistakes?
   Common JSON mistakes include missing quotes, trailing commas, single quotes, and invalid key names.
4. What is RESTful API? What does "resource" mean in REST?
   A RESTful API manages resources through standard HTTP methods, where a resource is any identifiable data object.
5. What is CRUD? How does CRUD map to HTTP methods?
   CRUD stands for Create, Read, Update, and Delete, which map to POST, GET, PUT/PATCH, and DELETE respectively.
6. What is the difference between POST, PUT, and PATCH?
   POST creates resources, PUT replaces an entire resource, and PATCH updates part of a resource.
7. What does idempotent mean in HTTP? Which common methods are idempotent?
   An idempotent method produces the same result when executed multiple times, and common idempotent methods include GET, PUT, DELETE, and HEAD.
8. List common HTTP status codes in 2xx, 3xx, 4xx, and 5xx. When would you use each category?
   2xx indicates success, 3xx indicates redirection, 4xx indicates client errors, and 5xx indicates server errors.
9. What is the difference between 400, 401, 403, and 404?
   400 means bad request, 401 means authentication required, 403 means access denied, and 404 means resource not found.
10. What is Node.js? Why is Node.js not a framework?
    Node.js is a JavaScript runtime environment, not a framework, because it provides a runtime instead of application structure.
11. Why can Node.js handle many concurrent requests even though JavaScript runs on a single main thread?
    Node.js handles many concurrent requests using its non-blocking I/O model and Event Loop.
12. What is the Event Loop in Node.js?
    The Event Loop continuously processes asynchronous callbacks after synchronous code finishes executing.
13. What is the execution order of synchronous code, process.nextTick, Promise.then, setTimeout, and setImmediate?
    The execution order is synchronous code → process.nextTick → Promise.then → setTimeout → setImmediate.
14. What kinds of operations can block the Node.js event loop?
    CPU-intensive tasks, synchronous file operations, and infinite loops can block the Node.js event loop.
15. What is the difference between CommonJS and ES Modules?
    CommonJS uses require and module.exports, while ES Modules use import and export.
16. What are fs, path, and http core modules used for?
    fs handles file operations, path works with file paths, and http creates HTTP servers and clients.
17. What is the difference between callback, Promise, and async/await?
    Callbacks use functions for async tasks, Promises improve readability, and async/await provides synchronous-looking asynchronous code.
18. What is unhandledRejection? Why should backend services handle it?
    unhandledRejection occurs when a Promise rejection is not caught, and backend services should handle it to avoid crashes and unexpected behavior.
19. What is Express? What problem does it solve on top of Node's http module?
    Express is a web framework that simplifies routing, middleware, and HTTP request handling on top of Node.js.
20. What is Express middleware? What happens if a middleware does not call next() or send a response?
    Express middleware processes requests, and if it neither calls next() nor sends a response, the request will hang.
21. What is the difference between req.params, req.query, and req.body?
    req.params contains route parameters, req.query contains URL query parameters, and req.body contains request body data.
22. How does Express handle errors? Why must error middleware have 4 parameters?
    Express handles errors with error-handling middleware, which must have four parameters (err, req, res, next) so Express can recognize it as an error handler.
