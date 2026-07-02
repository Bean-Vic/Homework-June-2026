# Task 6 — Async Error Handling Refactor

Small Express app whose async routes are wrapped with a single `asyncHandler`
helper, so no route needs its own `try/catch`. Every thrown async error is
forwarded to one global error middleware.

## Install

```bash
npm install
```

## Run

```bash
npm start
# or pick a port if 3000 is taken:
PORT=3456 npm start
```

Server listens on `http://localhost:3000` by default (override with `PORT`).

## Routes

| Method | Path            | Behaviour                                            |
| ------ | --------------- | ---------------------------------------------------- |
| GET    | `/slow-success` | Waits 300ms, returns `200` with a success payload.   |
| GET    | `/slow-fail`    | Waits 300ms, throws — reaches error middleware `500`. |
| GET    | `/read-file`    | Reads `data.txt` asynchronously, returns its content. |
| GET    | `/order-demo`   | Extra credit: shows event-loop ordering.             |

Unknown routes return a JSON `404`.

## Test the API

```bash
curl http://localhost:3000/slow-success
curl http://localhost:3000/slow-fail
curl http://localhost:3000/read-file
curl http://localhost:3000/order-demo
curl http://localhost:3000/does-not-exist
```

Example responses:

```json
// GET /slow-success  -> 200
{ "status": "ok", "message": "slow success after 300ms" }

// GET /slow-fail  -> 500
{ "error": { "message": "slow failure after 300ms", "status": 500 } }

// GET /order-demo  -> 200
{ "order": ["sync-start", "sync-end", "process.nextTick", "promise.then", "setTimeout"] }
```

## How the async errors are handled

- `asyncHandler(fn)` wraps an async route handler, runs it through
  `Promise.resolve(...)`, and pipes any rejection into `next(err)`.
- Because every async route is wrapped, a `throw` inside an `async` handler
  (or a rejected promise) lands in the single 4-argument error middleware
  instead of crashing the process or hanging the request.
- A `process.on('unhandledRejection')` handler logs the reason as a safety net
  for rejections that escape the request lifecycle.

## Event-loop ordering (extra credit)

`GET /order-demo` schedules work with `setTimeout`, `Promise.then`, and
`process.nextTick` and records the order in which they actually run:

```
["sync-start", "sync-end", "process.nextTick", "promise.then", "setTimeout"]
```

Observations:

1. Synchronous code runs first and to completion (`sync-start`, `sync-end`).
2. `process.nextTick` callbacks run next — the next-tick queue is drained
   before other microtasks.
3. Promise `.then` callbacks (the microtask queue) run after the next-tick
   queue.
4. `setTimeout` callbacks (timer phase macrotask) run last, after all
   microtasks have drained.
