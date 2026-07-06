# Node.js Homework

This repository contains six Node.js and Express exercises.

---

# Project Structure

```
Node-Homework
├── 01-json-validator
├── 02-file-summary
├── 03-native-http-server
├── 04-express-user-api
├── 05-express-middleware-lab
└── 06-async-error-handling
```

---

# 1. JSON Request Validator

## Install

No additional dependencies are required.

## Run

```bash
cd 01-json-validator
node validate-json.js samples/valid.json
```

Test invalid JSON syntax:

```bash
node validate-json.js samples/invalid-syntax.json
```

Test invalid business data:

```bash
node validate-json.js samples/invalid-business.json
```

---

# 2. Node.js File Summary Tool

## Install

No additional dependencies are required.

## Run

```bash
cd ../02-file-summary
node file-summary.js sample.txt
```

Test with a missing file:

```bash
node file-summary.js missing.txt
```

The program prints:

- File Name
- Extension
- Absolute Path
- File Size
- Line Count
- Word Count

---

# 3. Native Node HTTP Server

## Install

No additional dependencies are required.

## Start Server

```bash
cd ../03-native-http-server
node server.js
```

Server runs at:

```
http://localhost:3000
```

## Test API

Health Check

```bash
curl http://localhost:3000/health
```

Current Time

```bash
curl http://localhost:3000/api/time
```

Get All Users

```bash
curl http://localhost:3000/api/users
```

Get User By ID

```bash
curl http://localhost:3000/api/users/1
```

Create User

```bash
curl -X POST http://localhost:3000/api/users \
-H "Content-Type: application/json" \
-d '{"name":"Tom","email":"tom@test.com","role":"student"}'
```

---

# 4. Express User Directory API

## Install

```bash
cd ../04-express-user-api
npm install
```

## Start Server

```bash
node app.js
```

Server runs at:

```
http://localhost:3000
```

## Test API

Get All Users

```bash
curl http://localhost:3000/users
```

Filter by Role

```bash
curl "http://localhost:3000/users?role=admin"
```

Pagination

```bash
curl "http://localhost:3000/users?page=1&limit=5"
```

Get User By ID

```bash
curl http://localhost:3000/users/1
```

Create User

```bash
curl -X POST http://localhost:3000/users \
-H "Content-Type: application/json" \
-d '{"name":"Tom","email":"tom@test.com","role":"student"}'
```

Update User

```bash
curl -X PUT http://localhost:3000/users/1 \
-H "Content-Type: application/json" \
-d '{"name":"Tom","email":"tom@test.com","role":"mentor"}'
```

Partial Update

```bash
curl -X PATCH http://localhost:3000/users/1 \
-H "Content-Type: application/json" \
-d '{"role":"admin"}'
```

Delete User

```bash
curl -X DELETE http://localhost:3000/users/1
```

---

# 5. Express Middleware Lab

## Install

```bash
cd ../05-express-middleware-lab
npm install
```

## Start Server

```bash
node app.js
```

Server runs at:

```
http://localhost:3000
```

## Test API

Public Route

```bash
curl http://localhost:3000/public
```

Profile

```bash
curl http://localhost:3000/profile \
-H "Authorization: Bearer user-token"
```

Admin Route

```bash
curl http://localhost:3000/admin/reports \
-H "Authorization: Bearer admin-token"
```

Unauthorized Request

```bash
curl http://localhost:3000/profile
```

Forbidden Request

```bash
curl http://localhost:3000/admin/reports \
-H "Authorization: Bearer user-token"
```

Error Demo

```bash
curl http://localhost:3000/error-demo
```

---

# 6. Async Error Handling

## Install

```bash
cd ../06-async-error-handling
npm install
```

## Start Server

```bash
node app.js
```

Server runs at:

```
http://localhost:3000
```

## Test API

Slow Success

```bash
curl http://localhost:3000/slow-success
```

Slow Failure

```bash
curl http://localhost:3000/slow-fail
```

Read File

```bash
curl http://localhost:3000/read-file
```

---

# Technologies Used

- Node.js
- Express
- fs/promises
- HTTP Module
- Middleware
- REST API
- Async/Await
- Error Handling
