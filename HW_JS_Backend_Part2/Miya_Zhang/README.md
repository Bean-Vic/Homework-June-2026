# HW12 JavaScript Backend Fundamentals Part 2 - MongoDB and Mongoose

## Student
Miya Zhang

## MongoDB Connection

I used MongoDB through `MONGODB_URI` in a local `.env` file. The real `.env` file is not uploaded to GitHub because it may contain a real password or connection string.

Create a local `.env` file inside the `coding` folder:

```env
MONGODB_URI=your_mongodb_connection_string_here
PORT=3000
```

I included `.env.example` as a safe example.

## Install

From the `coding` folder:

```bash
npm install
```

## Run Scripts

### 1. MongoDB Native Driver CRUD Script

```bash
npm run crud
```

This script connects with the native MongoDB driver, creates a `users` collection if needed, inserts users, queries users, updates one user, deletes one test user, creates a unique email index, and shows a duplicate email error.

### 2. Mongoose User Model and Validation

```bash
npm run model
```

This script creates a Mongoose `User` model with validation, creates users, demonstrates validation errors, demonstrates `runValidators: true`, and uses `find`, `findOne`, `findByIdAndUpdate`, `select`, `sort`, `limit`, `skip`, and `lean`.

### 3, 4, and 5. Express + MongoDB + Mongoose API

```bash
npm start
```

The server starts on `http://localhost:3000` by default.

Main routes:

```text
GET    /health
POST   /users
GET    /users
GET    /tasks
GET    /tasks/:id
POST   /tasks
PATCH  /tasks/:id
DELETE /tasks/:id
POST   /projects
POST   /projects/:projectId/tasks
GET    /projects/:projectId
GET    /reports/tasks/summary
GET    /reports/tasks/by-project
GET    /reports/tasks/by-assignee
GET    /reports/tasks/overdue
GET    /reports/tasks/grouped?groupBy=status
```

Example task body for `POST /tasks`:

```json
{
  "title": "Finish HW12",
  "description": "Complete MongoDB and Mongoose homework",
  "status": "todo",
  "priority": "high",
  "dueDate": "2026-07-20"
}
```

Example filters:

```text
GET /tasks?status=todo
GET /tasks?priority=high
GET /tasks?page=1&limit=5
GET /tasks?sortBy=dueDate
GET /tasks?q=homework
GET /reports/tasks/summary?startDate=2026-07-01&endDate=2026-07-31
```

### 6. Batch Import Job

```bash
npm run import:tasks
npm run import:users
npm run import:dry
```

You can also run it manually:

```bash
node import.js --file data/tasks.json --type tasks
node import.js --file data/users.json --type users
node import.js --file data/tasks.json --type tasks --dry-run
```

The import job reads JSON or NDJSON, validates input, skips duplicates, writes valid data to MongoDB with `bulkWrite`, prints an import summary, and writes failed records to `failed-records.json`.

### 7. Index and Query Performance Lab

```bash
npm run index
```

This script seeds at least 1,000 task documents, runs queries before and after indexes, creates a single-field index on `status`, creates a compound index on `{ status: 1, dueDate: -1 }`, and prints `explain('executionStats')` results.

## Short Index Summary

The status query becomes faster after adding the single-field index on `status` because MongoDB can use the index instead of scanning all task documents. The query that filters by `status` and sorts by `dueDate` benefits from the compound index `{ status: 1, dueDate: -1 }`, because the first field helps MongoDB filter and the second field helps with sorting. The order of fields in a compound index matters because MongoDB uses the leftmost prefix of the index. Too many indexes can hurt write performance because every insert, update, or delete may also need to update multiple index structures.

## Peer Mock

Recording link: paste your recording link here.
