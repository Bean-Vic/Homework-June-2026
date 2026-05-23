# HW12: JavaScript Backend Fundamentals Part 2 - MongoDB and Mongoose

# HW: JavaScript Backend Fundamentals Part 2 - MongoDB and Mongoose

## Submission

创建一个新的 GitHub branch，并在 `HW_JS_Backend_Part2/<your-name>/` 下提交：

1. `note.md`: 问答练习答案。
2. `coding/`: 编程题代码。
3. `README.md`: MongoDB 连接方式、环境变量、如何启动、如何测试 API。
4. Peer Mock 录音文件或链接。

可以使用本地 MongoDB、MongoDB Atlas，或课程指定的测试数据库。不要提交真实密码或连接字符串。

---

## 1. 问答练习（八股）

准备以下题目的答案，写在 `note.md` 里。每题建议 3-6 句话，重点解释概念、使用场景和常见坑。

```
1. What is MongoDB? What kind of data model does it use?
2. What is BSON? How is it related to JSON?
3. Database vs Collection vs Document vs Field in MongoDB.
4. How do MongoDB concepts compare with SQL database, table, row, and column?
5. What is _id in MongoDB? When is it generated?
6. What is the difference between insertOne and insertMany?
7. What is the difference between find and findOne?
8. Why does updateOne usually need $set? What happens if you forget $set?
9. What are common MongoDB query operators such as $eq, $gte, $in, $or, $exists, and $regex?
10. What is an index in MongoDB? What are the benefits and costs?
11. What is a compound index? Why does field order matter?
12. When should you use MongoDB aggregation pipeline instead of processing data in JavaScript?
13. What do $match, $group, $sort, $project, $limit, and $lookup do?
14. What is Mongoose? Is it the official MongoDB driver?
15. What is the difference between Schema and Model in Mongoose?
16. What Mongoose schema options or validators are commonly used?
17. When does Mongoose validation run by default? How do you enable validators for update operations?
18. What are Mongoose hooks / middleware? What is the difference between pre and post hooks?
19. Why should you avoid arrow functions in some Mongoose hooks and virtuals?
20. What does lean() do? When would you use it?
21. What does populate() do? What are its performance tradeoffs?
22. What are virtual fields in Mongoose? Why do virtuals not always appear in JSON output?
```

⼩组间Peer Mock，录⾳并上传

---

## 2. Coding

### 1. MongoDB Native Driver CRUD Script

Build a Node.js script using the native MongoDB driver.

Requirements:

1. Connect to MongoDB using `MONGODB_URI` from `.env`.
2. Create a `users` collection if needed.
3. Insert at least 5 users with `insertMany`.
4. Query users with:
    1. age greater than or equal to 18
    2. role in `student` or `mentor`
    3. email exists
5. Update one user with `$set`.
6. Delete one test user.
7. Print each step’s result clearly.
8. Close the database connection safely.

Extra Credit:

1. Add a unique index on `email`.
2. Demonstrate what happens when duplicate email insertion is attempted.

---

### 2. Mongoose User Model and Validation

Build a Mongoose model for `User`.

Fields:

1. `name`: string, required, trim, min length 2.
2. `email`: string, required, unique, lowercase, custom email validator.
3. `age`: number, min 0, max 150, default 18.
4. `role`: enum `student`, `mentor`, `admin`, default `student`.
5. `tags`: array of strings.
6. `profile.bio`: optional string.

Requirements:

1. Use `timestamps`.
2. Create at least 3 users.
3. Demonstrate validation errors with invalid data.
4. Demonstrate that update validators require `runValidators: true`.
5. Use `find`, `findOne`, `findByIdAndUpdate`, `select`, `sort`, `limit`, `skip`, and `lean`.

Extra Credit:

1. Add a virtual field `displayName`.
2. Configure virtuals to appear in JSON output.

---

### 3. Task Management REST API with Express + MongoDB + Mongoose

Build a `Task Management REST API`.

Routes:

1. `GET /tasks`
2. `GET /tasks/:id`
3. `POST /tasks`
4. `PATCH /tasks/:id`
5. `DELETE /tasks/:id`

Each task should contain:

1. `title`
2. `description`
3. `status` (`todo`, `in_progress`, `done`)
4. `priority` (`low`, `medium`, `high`)
5. `dueDate`
6. `createdAt` and `updatedAt`

Requirements:

1. Use Mongoose Schema and Model.
2. Validate required fields and enum fields.
3. `GET /tasks` should support filtering by `status`.
4. `GET /tasks` should support filtering by `priority`.
5. `GET /tasks` should support pagination with `page` and `limit`.
6. `GET /tasks` should support sorting with `sortBy=createdAt` or `sortBy=dueDate`.
7. Handle invalid input, invalid ObjectId, and not found cases properly.
8. All responses should be JSON.

Extra Credit:

1. Support keyword search on `title` with `$regex`.
2. Implement soft delete with `deletedAt`.

---

### 4. Mini Project Models with Populate

Build Mongoose data models for a mini project system.

Models:

1. `User`
2. `Project`
3. `Task`

Suggested fields:

1. `User`: `name`, `email`, `role`
2. `Project`: `name`, `slug`, `owner`
3. `Task`: `title`, `status`, `assignee`, `project`, `dueDate`

Requirements:

1. Use `required`, `enum`, `default`, `unique`, and `timestamps`.
2. Use ObjectId references for `owner`, `assignee`, and `project`.
3. Implement a `pre('save')` hook that auto-generates `slug` before saving a project.
4. Do not use arrow function for hooks that need `this`.
5. Implement routes:
    1. `POST /projects`
    2. `POST /projects/:projectId/tasks`
    3. `GET /projects/:projectId`
    4. `GET /tasks/:taskId`
6. Use `populate()` to return project owner and task assignee.

Extra Credit:

1. Add a virtual field `taskCount` or `fullName`.
2. Add nested populate for project tasks and assignees.

---

### 5. Reporting API with Aggregation Pipeline

Build a reporting API based on your `tasks` collection.

Routes:

1. `GET /reports/tasks/summary`
2. `GET /reports/tasks/by-project`
3. `GET /reports/tasks/by-assignee`
4. `GET /reports/tasks/overdue`

Requirements:

1. Use MongoDB aggregation pipeline. Do not fetch all data into JavaScript and manually summarize it.
2. Use at least 4 of these stages:
    1. `$match`
    2. `$group`
    3. `$sort`
    4. `$project`
    5. `$limit`
    6. `$lookup`
3. Include total task count.
4. Include task count by status.
5. Include task count by project.
6. Include task count by assignee.
7. Support date range filtering with `startDate` and `endDate`.
8. Return clean JSON responses.

Extra Credit:

1. Support dynamic `groupBy=status|priority|project|assignee`.
2. Cache report results with memory cache or Redis.

---

### 6. Batch Import Job

Build a Node.js batch import script for MongoDB.

Input:

1. `tasks.json`
2. `users.json`
3. or `events.ndjson`

Requirements:

1. Read the file using `fs/promises` or streams.
2. Support command line usage such as `node import.js --file tasks.json --type tasks`.
3. Clean and validate input data before writing to MongoDB.
4. Handle:
    1. file does not exist
    2. invalid JSON format
    3. missing required fields
    4. duplicate records
5. De-duplicate by `email` or `externalId`.
6. Use `insertMany` or `bulkWrite`.
7. Output an import summary:
    1. inserted count
    2. skipped count
    3. failed count
8. Write failed records to `failed-records.json`.

Extra Credit:

1. Add `-dry-run` mode.
2. Use streams for large NDJSON files.

---

### 7. Index and Query Performance Lab

Create a small experiment that demonstrates why indexes matter.

Requirements:

1. Seed at least 1,000 task documents.
2. Query by `status`, `priority`, and `dueDate`.
3. Create a single-field index on `status`.
4. Create a compound index on `{ status: 1, dueDate: -1 }`.
5. Use `explain('executionStats')` before and after creating indexes.
6. Write a short summary in README explaining:
    1. which query became faster
    2. why the compound index field order matters
    3. why too many indexes can hurt writes

Extra Credit:

1. Add a unique index and handle duplicate key errors.
2. Compare `.lean()` vs normal Mongoose documents for read-heavy queries.