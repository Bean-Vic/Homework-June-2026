# Task 4 — Express User Directory API

In-memory Express CRUD API for users.

## Install

```bash
npm install
```

## Run

```bash
npm start
# server: http://localhost:3000  (override with PORT=3999 npm start)
```

## User shape

```json
{
  "id": 1,
  "name": "Alice Chen",
  "email": "alice@example.com",
  "role": "student",
  "createdAt": "2026-06-21T00:00:00.000Z"
}
```

`role` must be one of `student`, `mentor`, `admin`.

## Routes

| Method | Path         | Description                                |
| ------ | ------------ | ------------------------------------------ |
| GET    | `/health`    | Health check                               |
| GET    | `/users`     | List users (filter, search, pagination)    |
| GET    | `/users/:id` | Get one user                               |
| POST   | `/users`     | Create a user                              |
| PUT    | `/users/:id` | Replace a user (all fields required)       |
| PATCH  | `/users/:id` | Partially update a user                    |
| DELETE | `/users/:id` | Delete a user                              |

### `GET /users` query parameters

| Param   | Example          | Description                            |
| ------- | ---------------- | -------------------------------------- |
| `role`  | `?role=mentor`   | Filter by role                         |
| `q`     | `?q=alice`       | Keyword search on `name` or `email`    |
| `page`  | `?page=2`        | Page number (default 1)                |
| `limit` | `?limit=5`       | Items per page (default 10, max 100)   |

Response:

```json
{
  "data": [ /* users */ ],
  "pagination": { "page": 1, "limit": 10, "total": 5, "totalPages": 1 }
}
```

## Error format

```json
{ "error": { "message": "validation failed", "details": ["email is required"] } }
```

Status codes: `200`, `201`, `400` (validation / invalid JSON / bad id), `404` (unknown user or route), `500`.

## Test with curl

```bash
curl localhost:3000/health
curl "localhost:3000/users?role=mentor&page=1&limit=2"
curl "localhost:3000/users?q=alice"
curl localhost:3000/users/1
curl -X POST localhost:3000/users -H 'Content-Type: application/json' \
  -d '{"name":"Frank","email":"frank@example.com","role":"student"}'
curl -X PUT localhost:3000/users/1 -H 'Content-Type: application/json' \
  -d '{"name":"Alice X","email":"alicex@example.com","role":"admin"}'
curl -X PATCH localhost:3000/users/2 -H 'Content-Type: application/json' -d '{"role":"admin"}'
curl -X DELETE localhost:3000/users/3
```

## Files

- `app.js` — app setup, `express.json()`, `/health`, 404 + error middleware
- `users.router.js` — Express Router with all `/users` routes
- `store.js` — in-memory data + seed
- `validation.js` — field validation for create/replace/patch
