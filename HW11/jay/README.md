# HW11 — Node.js & Express

Six small Node.js / Express exercises, from CLI tools built on Node built-ins
through a native HTTP server and up to full Express APIs with middleware and
async error handling. Each lives under `coding/` with its own README, source,
and sample data.

## Tasks

| # | Task | What it covers | Dependencies |
| - | ---- | -------------- | ------------ |
| 1 | [JSON Request Validator](coding/1-validate-json/) | CLI that validates JSON syntax and a user schema | None (built-ins) |
| 2 | [File Summary Tool](coding/2-file-summary/) | CLI that summarizes a file or a directory of `.txt`/`.md` files | None (built-ins) |
| 3 | [Native HTTP Server](coding/3-native-http-server/) | REST-like server using only the `http` module | None (built-ins) |
| 4 | [Express User Directory API](coding/4-express-user-api/) | In-memory CRUD API with filter/search/pagination | Express |
| 5 | [Express Middleware Lab](coding/5-express-middleware-lab/) | Logging, request id, auth, role guard, 404 + error handler | Express |
| 6 | [Async Error Handling Refactor](coding/6-async-error-handling/) | `asyncHandler` wrapper routing all async errors to one middleware | Express |

## Prerequisites

- Node.js 18+ recommended (Task 2 works on 16+).
- Tasks 1–3 have **no dependencies** and use only Node built-ins (`fs/promises`,
  `path`, `http`).
- Tasks 4–6 use Express — run `npm install` inside each folder first.

## Running

Each task is self-contained. From `coding/<task>/`:

```bash
# CLI tools (1, 2) — run directly with node
node validate-json.js samples/valid.json
node file-summary.js samples/hello.txt

# Servers (3–6) — install (where needed) then start
npm install        # tasks 4–6 only
npm start          # or: node server.js / node app.js
```

Servers listen on `http://localhost:3000` and honor a `PORT` override, e.g.
`PORT=4000 npm start`. See each task's README for full route tables and `curl`
examples.

## Highlights

- **Built-ins first (Tasks 1–3):** JSON validation, file/directory summaries,
  and a routed HTTP server — all without external packages, using async
  `fs/promises` (no sync file APIs).
- **Express CRUD (Task 4):** `/users` with role filtering, keyword search, and
  pagination; `POST`/`PUT`/`PATCH`/`DELETE` with field validation and a
  consistent error shape.
- **Middleware pipeline (Task 5):** ordered global stack (`requestId` →
  `requestLogger` → `express.json()` → rate limiter → routes → `notFound` →
  `errorHandler`), Bearer-token auth with role guards, and correlated request
  ids across logs and errors.
- **Async error handling (Task 6):** a single `asyncHandler` wrapper forwards
  every rejected promise to one 4-argument error middleware, plus an
  event-loop ordering demo (`nextTick` → `promise.then` → `setTimeout`).

## Extra credit

Several tasks include extra-credit work: `-pretty` output and array-of-users
validation (Task 1), directory summaries (Task 2), `role` query filtering and
request logging (Task 3), an in-memory per-IP rate limiter (Task 5), and the
event-loop ordering demo (Task 6).
