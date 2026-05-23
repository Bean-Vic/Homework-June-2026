# HW11: JavaScript Backend Fundamentals Part 1 - API, Node, Express

# HW: JavaScript Backend Fundamentals Part 1 - API, Node, Express

## Submission

创建一个新的 GitHub branch，并在 `HW_JS_Backend_Part1/<your-name>/` 下提交：

1. `note.md`: 问答练习答案。
2. `coding/`: 编程题代码。
3. `README.md`: 如何安装依赖、如何启动、如何测试 API。
4. Peer Mock 录音文件或链接。

---

## 1. 问答练习（八股）

准备以下题目的答案，写在 `note.md` 里。每题建议 3-6 句话，重点解释概念、使用场景和常见坑。

```
1. What is an API? What problem does it solve between frontend and backend?
2. What is JSON? What data types can JSON represent?
3. What are common JSON format mistakes?
4. What is RESTful API? What does "resource" mean in REST?
5. What is CRUD? How does CRUD map to HTTP methods?
6. What is the difference between POST, PUT, and PATCH?
7. What does idempotent mean in HTTP? Which common methods are idempotent?
8. List common HTTP status codes in 2xx, 3xx, 4xx, and 5xx. When would you use each category?
9. What is the difference between 400, 401, 403, and 404?
10. What is Node.js? Why is Node.js not a framework?
11. Why can Node.js handle many concurrent requests even though JavaScript runs on a single main thread?
12. What is the Event Loop in Node.js?
13. What is the execution order of synchronous code, process.nextTick, Promise.then, setTimeout, and setImmediate?
14. What kinds of operations can block the Node.js event loop?
15. What is the difference between CommonJS and ES Modules?
16. What are fs, path, and http core modules used for?
17. What is the difference between callback, Promise, and async/await?
18. What is unhandledRejection? Why should backend services handle it?
19. What is Express? What problem does it solve on top of Node's http module?
20. What is Express middleware? What happens if a middleware does not call next() or send a response?
21. What is the difference between req.params, req.query, and req.body?
22. How does Express handle errors? Why must error middleware have 4 parameters?
```

⼩组间Peer Mock，录⾳并上传

---

## 2. Coding

### 1. JSON Request Validator

Build a small Node.js CLI tool named `validate-json.js`.

Requirements:

1. Read a local JSON file path from command line arguments.
2. Parse the file with `fs/promises`.
3. Print `Valid JSON` if the file is valid.
4. If invalid, print a useful error message.
5. Validate that the root value is an object or array.
6. Reject JSON containing missing required fields for a sample user object: `name`, `email`, `role`.
7. Include at least 3 sample files: valid JSON, invalid JSON syntax, valid JSON but invalid business data.

Extra Credit:

1. Support `-pretty` to print formatted JSON.
2. Support validating an array of users.

---

### 2. Node.js File Summary Tool

Build a CLI tool named `file-summary.js`.

Requirements:

1. Accept a file path from command line arguments.
2. Use `fs/promises` and `path`.
3. Print file name, extension, absolute path, file size, line count, and word count.
4. Handle file-not-found errors cleanly.
5. Do not use synchronous file APIs.

Extra Credit:

1. Accept a directory path and summarize all `.txt` or `.md` files inside it.
2. Sort output by file size.

---

### 3. Native Node HTTP Server

Build a REST-like server using only Node’s built-in `http` module. Do not use Express in this task.

Routes:

1. `GET /health`: return `{ "status": "ok" }`.
2. `GET /api/time`: return current ISO timestamp.
3. `GET /api/users`: return an in-memory user list.
4. `GET /api/users/:id`: return one user by id.
5. `POST /api/users`: create a user from JSON request body.

Requirements:

1. Return JSON responses with correct `Content-Type`.
2. Return proper status codes: `200`, `201`, `400`, `404`, `405`.
3. Handle invalid JSON body.
4. Implement a small helper function for sending JSON responses.

Extra Credit:

1. Support query parameter filtering, for example `/api/users?role=admin`.
2. Add request logging with method, URL, status code, and response time.

---

### 4. Express User Directory API

Build an Express API using in-memory data.

Routes:

1. `GET /users`
2. `GET /users/:id`
3. `POST /users`
4. `PUT /users/:id`
5. `PATCH /users/:id`
6. `DELETE /users/:id`

Each user should include:

1. `id`
2. `name`
3. `email`
4. `role` (`student`, `mentor`, `admin`)
5. `createdAt`

Requirements:

1. Use `express.json()`.
2. Use `req.params`, `req.query`, and `req.body` in meaningful places.
3. `GET /users` should support filtering by `role`.
4. `GET /users` should support pagination with `page` and `limit`.
5. Validate required fields for create and update.
6. Return consistent JSON error responses.

Extra Credit:

1. Support keyword search by `name` or `email`.
2. Split routes into an Express Router module.

---

### 5. Express Middleware Lab

Build common Express middleware and demonstrate them with routes.

Middleware:

1. `requestLogger`: log method, URL, status code, and response time.
2. `requestId`: generate a unique id and attach it to `req.requestId`.
3. `auth`: read `Authorization: Bearer <token>` and reject missing/invalid tokens with `401`.
4. `requireRole(role)`: reject users without the required role with `403`.
5. `notFound`: return a JSON `404` for unknown routes.
6. `errorHandler`: return a consistent JSON error format.

Routes:

1. `GET /public`
2. `GET /profile`
3. `GET /admin/reports`
4. `GET /error-demo`

Requirements:

1. Show middleware execution order in code comments or README.
2. Include request id in logs and error responses.
3. Demonstrate `next(err)` and async error handling.

Extra Credit:

1. Implement a simple in-memory rate limiter.
2. Add `helmet` and `cors`, and explain what each one does in README.

---

### 6. Async Error Handling Refactor

Create a small Express app with three async routes and refactor it to use `asyncHandler`.

Routes:

1. `GET /slow-success`: waits 300ms and returns success.
2. `GET /slow-fail`: waits 300ms and throws an error.
3. `GET /read-file`: reads a local file asynchronously and returns its content.

Requirements:

1. Implement `asyncHandler(fn)`.
2. Avoid repeated `try/catch` in every route.
3. Make sure all thrown async errors reach global error middleware.
4. Add a global `process.on('unhandledRejection')` handler that logs the reason.

Extra Credit:

1. Add one route that compares `setTimeout`, `Promise.then`, and `process.nextTick` execution order.
2. Document the observed output in README.