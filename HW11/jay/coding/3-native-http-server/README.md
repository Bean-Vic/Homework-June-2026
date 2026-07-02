# Task 3 - Native Node HTTP Server

A REST-like server built with only Node's built-in `http` module (no Express).

## Install

No dependencies required. Node.js 18+ recommended.

## Start

```bash
npm start
# or
node server.js
```

The server listens on `http://localhost:3000` (override with `PORT=4000 node server.js`).

## Routes

| Method | Path             | Description                          | Status codes        |
| ------ | ---------------- | ------------------------------------ | ------------------- |
| GET    | `/health`        | Health check `{ "status": "ok" }`    | 200, 405            |
| GET    | `/api/time`      | Current ISO timestamp                | 200, 405            |
| GET    | `/api/users`     | In-memory user list                  | 200, 405            |
| GET    | `/api/users?role=admin` | Filter users by role          | 200                 |
| GET    | `/api/users/:id` | One user by id                       | 200, 400, 404, 405  |
| POST   | `/api/users`     | Create a user from JSON body         | 201, 400, 405       |

## Test with curl

```bash
curl localhost:3000/health
curl localhost:3000/api/time
curl localhost:3000/api/users
curl "localhost:3000/api/users?role=admin"
curl localhost:3000/api/users/2
curl localhost:3000/api/users/999        # 404
curl localhost:3000/api/users/abc        # 400

curl -X POST localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Dan","email":"dan@example.com","role":"student"}'   # 201

curl -X POST localhost:3000/api/users -d '{"name":"Dan"}'          # 400 missing fields
curl -X POST localhost:3000/api/users -d '{bad json}'             # 400 invalid JSON
curl -X DELETE localhost:3000/api/users                          # 405
curl localhost:3000/nope                                         # 404
```

## Notes

- JSON responses use `Content-Type: application/json` via a shared `sendJson` helper.
- Invalid JSON bodies are rejected with `400`.
- Extra credit: `role` query filtering on `/api/users` and request logging
  (method, URL, status code, response time) on every request.
