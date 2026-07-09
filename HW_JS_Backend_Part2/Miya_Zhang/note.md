## 1. What is MongoDB? What kind of data model does it use?

MongoDB is a NoSQL database. It uses a document data model, so data is stored as documents instead of rows and columns. A document looks similar to a JavaScript object or JSON object. I would use MongoDB when the data structure is flexible, or when different records may not have exactly the same fields.

## 2. What is BSON? How is it related to JSON?

BSON means Binary JSON. It is the format MongoDB uses internally to store documents. It is similar to JSON, but it supports more data types, like ObjectId, Date, and binary data. So when we write data, it may look like JSON, but MongoDB stores it as BSON.

## 3. Database vs Collection vs Document vs Field in MongoDB.

A database is the top-level container. Inside a database, we have collections. A collection contains many documents, and each document contains fields. For example, in a `shop` database, we may have a `users` collection, and each user document has fields like `name`, `email`, and `age`.

## 4. How do MongoDB concepts compare with SQL database, table, row, and column?

MongoDB database is similar to a SQL database. A MongoDB collection is similar to a SQL table. A document is similar to a row, and a field is similar to a column. The big difference is that MongoDB documents can have flexible structures, while SQL tables usually have a fixed schema.

## 5. What is \_id in MongoDB? When is it generated?

`_id` is the unique identifier for each document in a MongoDB collection. It works like a primary key in SQL. If we do not provide `_id` when inserting a document, MongoDB or the driver will generate one automatically, usually an ObjectId. In real projects, I normally let MongoDB generate it unless I have a specific business id to use.

## 6. What is the difference between insertOne and insertMany?

`insertOne` is used to insert one document into a collection. `insertMany` is used to insert multiple documents at the same time. If I only create one user, I use `insertOne`. If I import a list of products or seed test data, I use `insertMany`.

## 7. What is the difference between find and findOne?

`find` returns a cursor that can contain multiple matching documents. `findOne` returns only the first matching document. If I expect many results, like all active users, I use `find`. If I only need one record, like finding a user by email or id, I use `findOne`.

## 8. Why does updateOne usually need $set? What happens if you forget $set?

`$set` tells MongoDB to update only specific fields, without replacing the whole document. For example, if I only want to change a user's name, I use `$set: { name: "Miya" }`. If I forget `$set`, in many update cases MongoDB will reject the update because it expects an update operator. In older or replacement-style operations, forgetting update operators could also accidentally replace the whole document, so I always use `$set` when I only want to update fields.

## 9. What are common MongoDB query operators such as $eq, $gte, $in, $or, $exists, and $regex?

`$eq` means equal, and `$gte` means greater than or equal. `$in` checks if a field matches one of several values. `$or` lets us match one condition or another condition. `$exists` checks whether a field exists in the document. `$regex` is used for pattern matching, like searching names that contain a certain word.

## 10. What is an index in MongoDB? What are the benefits and costs?

An index helps MongoDB find data faster, similar to an index in a book. Without an index, MongoDB may need to scan many documents to find the result. The benefit is faster reads and queries. The cost is that indexes take extra storage, and writes can become slower because MongoDB also needs to update the index.

## 11. What is a compound index? Why does field order matter?

A compound index is an index built on more than one field. For example, we can create an index on `{ userId: 1, createdAt: -1 }`. Field order matters because MongoDB uses the index from left to right. So an index on `userId, createdAt` is good for queries using `userId`, but not always good for queries only using `createdAt`.

## 12. When should you use MongoDB aggregation pipeline instead of processing data in JavaScript?

I would use aggregation when filtering, grouping, sorting, or joining data can be done inside the database. This is usually better because it reduces the amount of data sent to the backend. For example, if I need to calculate total sales by user, aggregation is better than fetching all orders and calculating in JavaScript. JavaScript processing is okay for small data, but for large data, aggregation is usually cleaner and faster.

## 13. What do $match, $group, $sort, $project, $limit, and $lookup do?

`$match` filters documents, similar to `find`. `$group` groups documents and can calculate values like count or sum. `$sort` orders the result, and `$limit` limits how many documents are returned. `$project` controls which fields to include or create in the output. `$lookup` is used to join data from another collection, similar to a SQL join.

## 14. What is Mongoose? Is it the official MongoDB driver?

Mongoose is an ODM library for MongoDB and Node.js. It helps us define schemas, models, validation, hooks, and relationships in a more structured way. It is not the official MongoDB driver. The official driver is the MongoDB Node.js driver, and Mongoose is built on top of it to make development easier.

## 15. What is the difference between Schema and Model in Mongoose?

A Schema defines the structure and rules of a document, like what fields it has and what types they should be. A Model is created from a schema and is used to interact with the database. For example, a `userSchema` defines the shape of a user, and the `User` model lets us call methods like `User.find()` or `User.create()`. So schema is the blueprint, and model is the tool we use to query and save data.

## 16. What Mongoose schema options or validators are commonly used?

Common schema options include `timestamps`, which automatically adds `createdAt` and `updatedAt`. Common validators include `required`, `min`, `max`, `minlength`, `maxlength`, `enum`, and `match`. For example, I can make email required, or limit a role field to only `admin`, `user`, or `guest`. These validations help catch bad data before saving it to the database.

## 17. When does Mongoose validation run by default? How do you enable validators for update operations?

Mongoose validation runs by default when we call `save()` or `create()`. But for update methods like `updateOne` or `findByIdAndUpdate`, validators do not always run automatically. To enable them, we usually pass `{ runValidators: true }`. For example, `findByIdAndUpdate(id, update, { runValidators: true })` makes Mongoose check the schema rules during the update.

## 18. What are Mongoose hooks / middleware? What is the difference between pre and post hooks?

Mongoose hooks are functions that run before or after certain operations, like saving, validating, or removing a document. A `pre` hook runs before the operation happens. A `post` hook runs after the operation finishes. For example, I can use a `pre save` hook to hash a password before saving a user, and a `post save` hook to log something after the user is saved.

## 19. Why should you avoid arrow functions in some Mongoose hooks and virtuals?

In some Mongoose hooks and virtuals, `this` refers to the current document. Arrow functions do not have their own `this`, so `this` may not point to the document correctly. That can break code like `this.password` or `this.firstName`. So when I need to use `this` in Mongoose, I use a normal function instead of an arrow function.

## 20. What does lean() do? When would you use it?

`lean()` tells Mongoose to return plain JavaScript objects instead of full Mongoose documents. This makes queries faster and lighter because Mongoose does not add document methods, getters, setters, or change tracking. I would use `lean()` for read-only API responses when I just need to send data to the frontend. I would not use it if I need to call document methods or use virtuals that depend on Mongoose documents.

## 21. What does populate() do? What are its performance tradeoffs?

`populate()` is used to replace a referenced id with the actual document from another collection. For example, if a post has an `author` id, populate can load the full author object. It is convenient, but it can cost performance because it may require extra queries. If I overuse populate, the API can become slow, so I try to populate only the fields I really need.

## 22. What are virtual fields in Mongoose? Why do virtuals not always appear in JSON output?

Virtual fields are fields that are not stored in MongoDB, but are calculated by Mongoose. For example, we can create a `fullName` virtual from `firstName` and `lastName`. They do not always appear in JSON output because Mongoose does not include virtuals by default in `toJSON` or `toObject`. To show them, we need to enable options like `{ toJSON: { virtuals: true } }`.
