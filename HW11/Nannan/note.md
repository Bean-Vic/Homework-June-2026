API & JSON
1. What is an API? What problem does it solve between frontend and backend?
API stands for Application Programming Interface — it's a contract that lets two systems talk to each other. In web development, it solves the problem of how the frontend gets data from the backend without knowing the database schema or business logic. The frontend just calls endpoints and gets back structured data, usually JSON.

2. What is JSON? What data types can JSON represent?
JSON stands for JavaScript Object Notation — it's a lightweight text format for exchanging data. It supports strings, numbers, booleans, null, arrays, and objects. Note it doesn't support undefined, functions, dates, or comments — dates usually get serialized as ISO strings.

3. What are common JSON format mistakes?
The big ones are: trailing commas after the last item, using single quotes instead of double quotes, unquoted keys, and including comments. Also, undefined isn't valid JSON, and functions can't be serialized. JSON.stringify silently drops these, which can be confusing.

REST & HTTP
4. What is a RESTful API? What does "resource" mean in REST?
REST is an architectural style for designing APIs based on resources and HTTP methods. A resource is anything we can name and identify — a user, a post, a comment — each with its own URL like /users/123. We then use HTTP verbs to act on it: GET to read, POST to create, and so on. The key idea is the URL describes the thing, the method describes the action.

5. What is CRUD? How does CRUD map to HTTP methods?
CRUD stands for Create, Read, Update, Delete — the four basic database operations. In REST, Create maps to POST, Read to GET, Update to PUT or PATCH, and Delete to DELETE. So a typical resource API supports all four to provide full data management.

6. What is the difference between POST, PUT, and PATCH?
POST creates a new resource — the server usually assigns the ID, and it's not idempotent. PUT replaces an entire resource at a known URL — we send the whole object, and it's idempotent. PATCH does a partial update — we only send the fields we want to change. So PUT is "replace", PATCH is "modify".

7. What does idempotent mean in HTTP? Which common methods are idempotent?
Idempotent means calling the same request multiple times has the same effect as calling it once. GET, PUT, DELETE, and HEAD are idempotent — calling DELETE twice still leaves the resource deleted. POST is not idempotent because each call creates a new resource. Idempotency matters for retry safety — clients can retry without worrying about duplicates.

8. List common HTTP status codes in 2xx, 3xx, 4xx, and 5xx. When would you use each category?
2xx means success — like 200 OK, 201 Created, 204 No Content. 3xx means redirection — 301 Moved Permanently, 304 Not Modified. 4xx means client error — 400 Bad Request, 401 Unauthorized, 404 Not Found. 5xx means server error — 500 Internal Server Error, 503 Service Unavailable. So 4xx is "your fault", 5xx is "our fault".

9. What is the difference between 400, 401, 403, and 404?
400 Bad Request — the request itself is malformed, like invalid JSON. 401 Unauthorized — we're not authenticated, need to log in. 403 Forbidden — we're authenticated but don't have permission. 404 Not Found — the resource doesn't exist. So 400 is about the request, 401 about who you are, 403 about what you can do, and 404 about what exists.

Node.js
10. What is Node.js? Why is Node.js not a framework?
Node.js is a JavaScript runtime built on Chrome's V8 engine that lets us run JavaScript outside the browser, typically on a server. It's not a framework because it doesn't dictate how to structure code or build apps — it just provides a runtime and core modules. Frameworks like Express are built on top of Node.

11. Why can Node.js handle many concurrent requests even though JavaScript runs on a single main thread?
Because Node uses non-blocking I/O. The main thread just dispatches I/O work — like file reads or network requests — to the system or libuv's thread pool. While those run in the background, the main thread keeps handling other requests. When the work finishes, the callback is queued and runs on the main thread. So one thread can juggle thousands of concurrent operations as long as we don't block it.

12. What is the Event Loop in Node.js?
The event loop is what schedules and runs async callbacks in Node. It has multiple phases — timers, pending callbacks, poll for I/O, check, and close callbacks — and the loop cycles through them. Between every phase, microtasks like process.nextTick and promise callbacks run. It's basically the engine that keeps the single-threaded runtime non-blocking.

13. What is the execution order of synchronous code, process.nextTick, Promise.then, setTimeout, and setImmediate?
Synchronous code runs first. Then microtasks — process.nextTick first, followed by Promise.then. Then macrotasks — setTimeout in the timers phase, setImmediate in the check phase. So roughly: sync → nextTick → promise → setTimeout → setImmediate. Microtasks drain completely between each phase.

14. What kinds of operations can block the Node.js event loop?
CPU-heavy synchronous work — like big loops, JSON parsing of huge payloads, synchronous crypto, regex with catastrophic backtracking, and any fs.*Sync call. While the main thread is busy with these, no other requests can be handled. For heavy CPU work, we offload to worker threads or child processes.

15. What is the difference between CommonJS and ES Modules?
CommonJS is Node's original system — uses require and module.exports, loads synchronously, and resolves at runtime. ES Modules use import and export, load asynchronously, and resolve statically at parse time. ESM is the standard now — supports tree-shaking and top-level await. Modern Node supports both, but mixing them needs some care.

16. What are fs, path, and http core modules used for?
fs is for file system operations — reading, writing, watching files. path handles file paths cross-platform — joining, resolving, getting extensions, without worrying about Windows vs Unix slashes. http is for building HTTP servers and clients — it's the low-level module that Express is built on top of.

17. What is the difference between callback, Promise, and async/await?
Callbacks are the original async pattern — we pass a function that gets called when work finishes. Promises wrap async work in an object with .then and .catch, avoiding callback hell. Async/await is syntactic sugar over promises that makes async code read like sync code. Each one builds on the previous — same underlying mechanism, just cleaner syntax.

18. What is unhandledRejection? Why should backend services handle it?
unhandledRejection fires when a promise rejects and nobody catches it. On the backend, this matters because an unhandled rejection can crash the process in newer Node versions, or silently leak errors. We listen on process.on('unhandledRejection', handler) to log it, monitor it, and recover gracefully — usually by logging and exiting cleanly.

Express
19. What is Express? What problem does it solve on top of Node's http module?
Express is a minimal web framework on top of Node's http module. The raw http module is low-level — we have to parse URLs, handle methods, and read bodies manually. Express gives us routing, middleware, easy request parsing, and a clean API for building REST endpoints. It's the de facto standard for Node web apps.

20. What is Express middleware? What happens if a middleware does not call next() or send a response?
Middleware is a function that runs in sequence on each request — with access to req, res, and next. It can read or modify the request, send a response, or pass control to the next middleware. If we don't call next() or send a response, the request just hangs until it times out — which is a common bug.

21. What is the difference between req.params, req.query, and req.body?
req.params holds route parameters from the URL path — like :id in /users/:id. req.query holds query string values — the part after the ?, like ?sort=desc. req.body holds the parsed request body, usually from JSON or form data — we need a body parser middleware like express.json() for that to work.

22. How does Express handle errors? Why must error middleware have 4 parameters?
Express has special error-handling middleware that runs when we call next(err) with an argument. The signature must be (err, req, res, next) — four parameters. Express literally checks the function's arity to identify it as an error handler. We usually register it last so it catches errors from all earlier middleware and routes.
