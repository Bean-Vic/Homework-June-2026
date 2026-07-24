# HW12: JavaScript Backend Fundamentals Part 2 - MongoDB and Mongoose

## 1. What is MongoDB? What kind of data model does it use?

 MongoDB is a NoSQL database that uses the document-oriented data model.

 Instead of using tables, MongoDB stores data in BSON documents. It allows you to store and access related information together in a single document, which is more intuitive, and resembles the objects in the code.

## 2. What is BSON? How is it related to JSON?

 BSON stands for Binary JSON. It is the format in which data is stored in MongoDB.

 BSON is almost the same as JSON; they share the same syntax. However, BSON is a binary-encoded JSON, and it is faster to parse, and supports rich data types (like dates, raw binary data, and decimals).

## 3. Database vs Collection vs Document vs Field in MongoDB

- A Ddatabase is a physical container for data, and in terms of MongoDB, a Database contains collections.
- A collection is a grouping of documents which share the same or similar purpose or structure.
- A document is a single BSON record containing the actual data. If a collection is a list of users, a document is the data file of a specific user.
- A field is a key-value pair in a document, it is a property and its value.

## 4. How do MongoDB concepts compare with SQL database, table, row, and column?

- A database still means a physical container for data. A SQL database holds Tables directly, while in MongoDB, it contains Collections directly.
- So from the point of view of storing hierarchy, tables and collections are on the same level. However, a table in SQL database should be normalized to remove the redundancy, while a collection in MongoDB is actually denormalized and doesn't require a strict schema.
- A row in SQL is almost like a document in MongoDB; it is a single record of data.
- And a column in SQL resembles a field in MongoDB, which is a property and its value.

## 5. What is `_id` in MongoDB? When is it generated?

 `_id` is a mandatory field in every document, which acts as the primary key.

 You can explicitly provide an `_id` value when inserting the document, or if you attempt to insert a document without `_id`, the MongoDB driver or the database itself will automatically generate one for you, right before the document is saved.

## 6. What is the difference between `insertOne()` and `insertMany()`?

 They are both used to create documents to a collection. The difference is that `insertOne()` takes one object and creates a single document, and `insertMany()` takes an array of objects for multiple documents.

## 7. What is the difference between `find()` and `findOne()`?

- `find()` always returns a Cursor, which is a list of documents, even if there is only one match.
- `findOne()` returns the one or the first document object directly.

## 8. Why does `updateOne()` usually need `$set`? What happens if you forget `$set`?

 The `$set` operator tells the database to assign the payload value to the field, instead of incrementing or appending the value to the field (that is what `$inc` and `$push` do).

 An `updateOne()` needs to be used with operators like `$set` or `$inc` or `$push`, or MongoDB will throw an error.

## 9. What are common MongoDB query operators such as `$eq`, `$gte`, `$in`, `$or`, `$exists`, and `$regex`?

 In MongoDB, we query data by writing JSON objects with the help of operators.

 There are comparison operators, like `$eq` or `$gte`. And there are Logical operators like `$and`, `$or`, `$not` to combine, or to negate conditions.

 `$exists` is a little special, it is used to query based on if a field exists in a document, regardless of the value.
 `$regex` is used for filtering string values using Regular Expressions.

## 10. What is an index in MongoDB? What are the benefits and costs?

 An index is a B-Tree that stores a small portion of the collection's data alongside a pointer to the original document to enable an optimized search.

 The benefit is the drastically faster READ operations. The cost is the slower write operations, because the index must also be updated; plus index also consumes both RAM and disk space.

## 11. What is a compound index? Why does field order matter?

 A compound index is simply an index that includes multiple fields instead of just one.

 The field order matters because an index can only be utilized when its first field is included in a query.

## 12. When should you use MongoDB aggregation pipeline instead of processing data in JavaScript?

 Assuming the data already lives in MongoDB, I would probably, in most cases, use the aggregation pipeline because in this way, MongoDB does the math internally on its own server, so that I don't have to import the documents to the application server (Node.js server, for example), which will take up the RAM.

 I will only use JavaScript for data processing if it involves something MongoDB can't do, maybe making external API calls.

## 13. What do `$match`, `$group`, `$sort`, `$project`, `$limit`, and `$lookup` do?

- `$match` is essentially the `find()` equivalent in an aggregation pipeline, used to filter documents based on specific conditions.
- `$group` is used to group documents by a specified field and can thereby apply accumulator expressions (like `$sum`, `$avg`, `$push`) to each group.
- `$sort` is used to sort documents by specified fields as keys.
- `$project` reshapes documents, allowing you to include, exclude, or create new fields in the pipeline, and it doesn't affect the underlying documents.
- `$limit` restricts the number of documents passed to the next stage.
- `$lookup` performs a left outer join to another collection to filter in documents from the joined collection.

## 14. What is Mongoose? Is it the official MongoDB driver?

 Mongoose is an Object Data Model (ODM), that is mostly used in Node.js backend, as a layer between the application and the MongoDB. It is not the official MongoDB driver; instead, it wraps the native MongoDB driver, and it provide schema validation, and map database documents to JavaScript objects.

## 15. What is the difference between Schema and Model in Mongoose?

 A Schema defines the structure of the documents, also the default values, and the validation rules.

 A Model is a constructor function compiled from a Schema. It provides methods for querying and writing to the MongoDB collection.

## 16. What Mongoose schema options or validators are commonly used?

 Schema options affect the behavior of a schema and thereby a model, rather than individual fields. For example, `timestamps` is a schema option that setting it to `true` asks the model to create and manage the `createdAt` and `updatedAt` fields.

 `toJSON` and `toObject` are also schema options, in most cases are used to include the virtual fields.

 `strict` is also a schema option, and it is `true` by default so that the schema is strict instead of flexible.

 In terms of validators, `required`, `enum`, `min` and `max`, and `minLength`, `maxLength` are some most common validators, they are applied to individual fields.

## 17. When does Mongoose validation run by default? How do you enable validators for update operations?

 Mongoose runs validators when you create a new document or use the `.save()` method. But it skips validation in updating, unless you explicitly set the `runValidators` to `true` in the update methods.

## 18. What are Mongoose middleware / hooks? What is the difference between `pre` and `post` hooks?

 Mongoose middleware, or hooks, are functions that automatically run before or after certain database operations. So obviously there are `pre` hooks and `post` hooks.

- We use `pre` to attach functions to be executed before the database operation. For example, we can attach `pre` middleware before a `save` to modify data, or run validation. Or we attach `pre` middleware before a `find` to add a defult filter.
- On the other hand, `post` hooks run after the database operation, and that's why they are mostly for running side effects like logging.

## 19. Why should you avoid arrow functions in some Mongoose hooks and virtuals?

 It is because of the fact that in Mongoose, hooks and virtuals rely heavily on the `this` keyword to access the current document. However, in arrow functions, the `this` keyword points to the surrounding file's scope (which is usually `undefined`) so that it can't access the data document correctly.

## 20. What does `lean()` do? When would you use it?

 `lean()` tells Mongoose to return the `find()` results in JS Object instead of using the heavy Mongoose Document. I would always use `.lean()` in a read-only operation, except if it involves a virtual field or it will be followed by updates.

## 21. What does `populate()` do? What are its performance tradeoffs?

 `populate()` is used in queries to map the data across different collections, using `_id` as the key. It is very useful; but it may take a large RAM space and block the thread for a few milliseconds.

## 22. What are virtual fields in Mongoose? Why do virtuals not always appear in JSON output?

 A virtual is a field dynamically calculated from other fields and it is not stored to the underlying MongoDB database. It exists logically in the Mongoose application layer.

 The reason why virtuals do not always appear in JSON output it that, the `.toJSON()` method in Mongoose by default only prosses the fields that actually exist in the database.
