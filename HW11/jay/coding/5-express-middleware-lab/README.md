# Express Middleware Lab (HW11 Task 5)

Common Express middleware (logging, request id, auth, role guard, 404, error
handler) demonstrated with four routes.

## Install

```bash
npm install
```

## Run

```bash
npm start
```

The server listens on `http://localhost:3000` (override with `PORT`).

## Middleware execution order

Every request flows top to bottom through the global stack, then into the
matched route, then into the tail handlers:

1. `requestId` — assigns `req.requestId` (reuses an incoming `X-Request-Id`
   header if present) and echoes it back on the response.
2. `requestLogger` — records a start time and, on the response `finish` event,
   logs `method`, `url`, `status code`, response time, and the request id.
3. `express.json()` — parses JSON request bodies.
4. `rateLimiter` — in-memory per-IP limiter (extra credit).
5. Route handler — `/public`, `/profile`, `/admin/reports`, `/error-demo`.
   Route-level middleware (`auth`, `requireRole`) runs before its handler.
6. `notFound` — any unmatched route returns a JSON `404`.
7. `errorHandler` — the only 4-argument middleware; catches anything passed to
   `next(err)` and returns a consistent JSON error shape.

Because `requestId` runs first, its id is available to the logger, the 404
handler, and the error handler, so logs and error responses can be correlated.

## Routes

| Method | Path             | Auth                  |
| ------ | ---------------- | --------------------- |
| GET    | `/public`        | none                  |
| GET    | `/profile`       | Bearer token          |
| GET    | `/admin/reports` | Bearer token + admin  |
| GET    | `/error-demo`    | none (throws on call) |

## Tokens

`auth` reads `Authorization: Bearer <token>`. Sample tokens (see `tokens.js`):

| Token           | Role    |
| --------------- | ------- |
| `student-token` | student |
| `mentor-token`  | mentor  |
| `admin-token`   | admin   |

## Error format

Every error (401, 403, 404, 429, 500) returns the same shape:

```json
{
  "error": {
    "message": "Invalid token",
    "status": 401,
    "requestId": "..."
  }
}
```

## next(err) and async error handling

`GET /error-demo` is an `async` handler. Express 4 does not automatically catch
errors thrown inside async functions, so the route wraps its body in
`try/catch` and forwards the error with `next(err)`. The thrown async error then
reaches the global `errorHandler`, which responds with a `500` carrying the
request id. `auth` and `requireRole` use the same `next(err)` pattern for `401`
and `403`.

## Testing the API

```bash
curl -i http://localhost:3000/public

curl -i http://localhost:3000/profile
# -> 401, missing token

curl -i -H "Authorization: Bearer student-token" http://localhost:3000/profile
# -> 200, student profile

curl -i -H "Authorization: Bearer student-token" http://localhost:3000/admin/reports
# -> 403, requires admin role

curl -i -H "Authorization: Bearer admin-token" http://localhost:3000/admin/reports
# -> 200, reports

curl -i http://localhost:3000/error-demo
# -> 500, async error reaches errorHandler

curl -i http://localhost:3000/does-not-exist
# -> 404 from notFound
```

Watch the terminal running the server to see `requestLogger` output, including
the request id, status code, and response time for each call.

## Extra credit

- **Rate limiter** (`middleware/rateLimiter.js`): a dependency-free, in-memory,
  per-IP limiter. It allows `max` requests per `windowMs` and returns `429` with
  a `Retry-After` header once the window is exceeded. Configured in `app.js` as
  60 requests per minute.
- **helmet** and **cors**: not enabled by default to keep dependencies minimal.
  - `helmet` sets security-related HTTP response headers (e.g.
    `Content-Security-Policy`, `X-Content-Type-Options`, `Strict-Transport-Security`)
    to reduce common web vulnerabilities.
  - `cors` sets `Access-Control-Allow-*` headers so browsers on other origins
    are permitted to call the API, and answers preflight `OPTIONS` requests.
  - To enable: `npm install helmet cors`, then add `app.use(helmet())` and
    `app.use(cors())` near the top of the global middleware stack in `app.js`.
