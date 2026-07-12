
准备以下题目的答案，写在 `note.md` 里。每题建议 3-6 句话，重点解释概念、使用场景和常见坑。


**1. What is MongoDB? What kind of data model does it use?** 
MongoDB is a NoSQL database that stores data using a **document-oriented data model**. Instead of storing data in rows and tables, it stores flexible, JSON-like documents inside collections. Documents in the same collection can have different fields, although applications commonly enforce a consistent structure.

**2. What is BSON? How is it related to JSON?** 
BSON stands for **Binary JSON**. MongoDB stores documents internally in BSON, which represents data in a binary format while retaining a JSON-like structure. BSON supports additional data types that standard JSON does not, including `ObjectId`, `Date`, binary data, decimal numbers, and multiple integer sizes.

**3. Database vs. Collection vs. Document vs. Field in MongoDB.** 
A **database** is the highest-level container for related data. A database contains **collections**, which group related documents. A **document** is one individual record represented by key-value pairs, and a **field** is one named piece of data inside that document, such as `name`, `email`, or `age`.

**4. How do MongoDB concepts compare with SQL database, table, row, and column?** 
A MongoDB **database** corresponds roughly to a SQL database, a **collection** corresponds to a table, a **document** corresponds to a row, and a **field** corresponds to a column. The comparison is not exact because MongoDB documents can contain nested objects and arrays, and documents in the same collection do not necessarily need identical fields.

**5. What is `_id` in MongoDB? When is it generated?** 
The `_id` field is the unique primary identifier for a MongoDB document, and every document in a collection must have one. You can provide `_id` yourself, but when you omit it, the MongoDB driver normally generates an `ObjectId` before sending the document to the database. MongoDB automatically creates a unique index on `_id`.

**6. What is the difference between `insertOne` and `insertMany`?** 
`insertOne()` inserts one document into a collection, while `insertMany()` accepts an array and inserts multiple documents in one operation. `insertOne()` returns information such as the inserted document’s ID, whereas `insertMany()` returns the IDs of all inserted documents. Bulk insertion is generally more efficient than issuing many separate `insertOne()` operations.

**7. What is the difference between `find` and `findOne`?** 
`find()` searches for all documents that match a filter and returns a **cursor**, which can be iterated, sorted, limited, or converted into an array. `findOne()` returns the first matching document directly, or `null` when no document matches. Use `findOne()` when you expect only one result and `find()` when you may need multiple results.

**8. Why does `updateOne` usually need `$set`? What happens if you forget `$set`?** 
`$set` tells MongoDB to change only the specified fields while preserving the document’s other fields, as in `updateOne({_id: id}, {$set: {name: "Jay"}})`. In the native MongoDB API, passing a normal document without an update operator generally causes an error because `updateOne()` expects update operators or an aggregation pipeline. To replace the entire document, use `replaceOne()` instead.

**9. What are common MongoDB query operators such as `$eq`, `$gte`, `$in`, `$or`, `$exists`, and `$regex`?** 
`$eq` checks whether a field equals a value, `$gte` checks whether it is greater than or equal to a value, and `$in` checks whether it matches any value in an array. `$or` matches documents satisfying at least one supplied condition, `$exists` checks whether a field is present or absent, and `$regex` matches strings using a regular-expression pattern.

**10. What is an index in MongoDB? What are the benefits and costs?** 
An index is an additional data structure that helps MongoDB locate matching documents without scanning every document in a collection. Indexes can greatly improve filtering, sorting, and lookup performance, and unique indexes can enforce uniqueness. Their costs include additional storage and memory usage, as well as slower inserts, updates, and deletes because MongoDB must update the relevant indexes whenever indexed data changes.

**11. What is a compound index? Why does field order matter?** 
A compound index stores multiple fields in one index, such as `{status: 1, createdAt: -1}`. Field order matters because MongoDB can efficiently use the index’s leftmost prefix: this index supports queries beginning with `status` and queries involving both `status` and `createdAt`, but generally cannot efficiently support a query using only `createdAt`. Order also affects whether an index can satisfy sorting and range conditions.

**12. When should you use the MongoDB aggregation pipeline instead of processing data in JavaScript?** 
Use an aggregation pipeline when filtering, grouping, joining, calculating, sorting, or reshaping large amounts of database data. Running these operations inside MongoDB usually reduces the amount of data transferred to the application and lets the database optimize execution and use indexes. JavaScript processing is more appropriate for application-specific logic that cannot be conveniently expressed through aggregation stages.

**13. What do `$match`, `$group`, `$sort`, `$project`, `$limit`, and `$lookup` do?** 
`$match` filters documents, `$group` combines documents and calculates aggregate values, `$sort` orders the results, `$project` selects, removes, renames, or calculates fields, and `$limit` restricts the number of documents returned. `$lookup` performs a left outer join with another collection and places the matching documents into an array field.

**14. What is Mongoose? Is it the official MongoDB driver?** 
Mongoose is an **Object Data Modeling library**, or ODM, for MongoDB and Node.js. It adds schemas, models, validation, middleware, virtual fields, and other application-level features on top of the MongoDB Node.js driver. It is not the official driver; the official low-level package is the MongoDB Node.js driver.

**15. What is the difference between `Schema` and `Model` in Mongoose?** 
A Mongoose `Schema` defines the expected structure, data types, validation rules, indexes, methods, middleware, and other behavior of documents. A `Model` is a class compiled from that schema and provides methods such as `find()`, `create()`, `updateOne()`, and `deleteOne()` for interacting with the corresponding collection. Instances of a model are Mongoose documents.

**16. What Mongoose schema options or validators are commonly used?** 
Common field options include `type`, `required`, `default`, `unique`, `index`, `select`, `immutable`, lowercase conversion, uppercase conversion, and trimming. Common validators include `min`, `max`, `minLength`, `maxLength`, `enum`, `match`, and custom `validate` functions. Common schema-level options include `timestamps`, which adds `createdAt` and `updatedAt`, and `strict`, which controls how undeclared fields are handled.

**17. When does Mongoose validation run by default? How do you enable validators for update operations?** 
Mongoose validation runs automatically before a document is saved with methods such as `save()` and normally runs when documents are created. Update operations such as `updateOne()` and `findOneAndUpdate()` do not run all update validators by default, so you normally enable them by passing `{runValidators: true}`. Update validation has some differences from document validation because it generally checks only the fields being updated.

**18. What are Mongoose hooks or middleware? What is the difference between `pre` and `post` hooks?** 
Mongoose middleware consists of functions that run during operations such as validation, saving, querying, updating, deleting, and aggregation. A `pre` hook runs before an operation and can modify data, perform checks, or stop the operation by throwing an error. A `post` hook runs after the operation has completed and is commonly used for logging, transformations, notifications, or error handling.

**19. Why should you avoid arrow functions in some Mongoose hooks and virtuals?** 
Arrow functions do not create their own `this` value and instead inherit `this` from their surrounding scope. Many Mongoose hooks, methods, getters, setters, and virtuals use `this` to refer to the current document, query, model, or aggregation object. A normal `function` should therefore be used whenever the callback needs Mongoose’s dynamically assigned `this`.

**20. What does `lean()` do? When would you use it?** 
`lean()` tells Mongoose to return plain JavaScript objects instead of creating full Mongoose document instances. This reduces memory usage and processing overhead, making it useful for read-only queries such as API responses where documents will not be modified and saved. Lean results do not have normal document methods, change tracking, `save()`, or every getter and virtual behavior unless additional options or plugins are used.

**21. What does `populate()` do? What are its performance trade-offs?** 
`populate()` replaces referenced IDs with documents retrieved from another collection, giving Mongoose behavior similar to loading related records. It is convenient but may require additional database queries and can retrieve much more data than necessary, increasing latency, memory usage, and network traffic. For performance, select only necessary fields, avoid deeply nested population, limit populated results, and consider embedding data or using `$lookup` when appropriate.

**22. What are virtual fields in Mongoose? Why do virtuals not always appear in JSON output?** 
Virtual fields are calculated properties that are not physically stored in MongoDB, such as a `fullName` virtual built from `firstName` and `lastName`. They do not appear in normal JSON or object conversion by default because they are Mongoose-level properties rather than stored fields. You can include them by configuring the schema with options such as `{toJSON: {virtuals: true}, toObject: {virtuals: true}}`.


⼩组间Peer Mock，录⾳并上传
