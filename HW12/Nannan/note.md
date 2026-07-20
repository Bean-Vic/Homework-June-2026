MongoDB Basics
1. What is MongoDB? What kind of data model does it use?
MongoDB is a NoSQL database that stores data as flexible JSON-like documents instead of rows and columns. It's document-oriented — each document can have its own structure, no fixed schema required. This makes it great for data that evolves over time or has nested, hierarchical shapes.

2. What is BSON? How is it related to JSON?
BSON stands for Binary JSON — it's the binary format MongoDB actually uses to store and transmit documents. It extends JSON with types JSON doesn't have, like dates, ObjectIds, and binary data. So we write queries in JSON-like syntax, but MongoDB stores them as BSON for speed and richer typing.

3. Database vs Collection vs Document vs Field in MongoDB.
A database is the top-level container. A collection is a group of related documents — like a table. A document is a single record stored as a BSON object. A field is a key-value pair inside a document. So the hierarchy is: database → collection → document → field.

4. How do MongoDB concepts compare with SQL database, table, row, and column?
It's basically a one-to-one mapping: database to database, collection to table, document to row, and field to column. The big difference is that MongoDB documents don't need a fixed schema — each document in a collection can have different fields. And MongoDB supports nested objects and arrays natively, which SQL doesn't really do.

5. What is _id in MongoDB? When is it generated?
_id is the primary key for every document — it's required and must be unique within a collection. If we don't provide one when inserting, MongoDB auto-generates an ObjectId — a 12-byte value that encodes a timestamp, machine ID, and counter. We can also use our own value, like a UUID or a custom string.

CRUD Operations
6. What is the difference between insertOne and insertMany?
insertOne inserts a single document and returns its ID. insertMany inserts an array of documents in one round trip — much faster than calling insertOne in a loop. By default it stops on the first error, but we can pass { ordered: false } to continue inserting the rest.

7. What is the difference between find and findOne?
find returns a cursor to all matching documents, which we can iterate or convert to an array. findOne returns just the first matching document directly — no cursor, no array. So we use findOne when we know there's only one result, like fetching a user by ID.

8. Why does updateOne usually need $set? What happens if you forget $set?
$set tells MongoDB to update only the specified fields and leave the rest alone. If we forget $set and just pass a plain object, MongoDB replaces the entire document with that object — except for the _id. That usually wipes out all the other fields, which is rarely what we want.

9. What are common MongoDB query operators such as $eq, $gte, $in, $or, $exists, and $regex?
$eq is equals, $gte is greater than or equal. $in matches any value in an array. $or combines multiple conditions where any can match. $exists checks whether a field is present at all. $regex matches with a regular expression — useful for partial string search.

Indexes & Aggregation
10. What is an index in MongoDB? What are the benefits and costs?
An index is a data structure that lets MongoDB find documents fast without scanning the whole collection. The benefit is huge query speedup, especially on large datasets. The cost is extra storage, and slower writes — because every insert or update has to also update the indexes. So we index fields we query often, not everything.

11. What is a compound index? Why does field order matter?
A compound index covers multiple fields together, like { userId: 1, createdAt: -1 }. Field order matters because MongoDB can only use the index efficiently if the query matches the leftmost fields — this is called the prefix rule. So an index on userId, createdAt helps queries on just userId, but not on just createdAt.

12. When should you use MongoDB aggregation pipeline instead of processing data in JavaScript?
Use aggregation when we're working with large datasets or doing heavy grouping, filtering, or joining. It runs inside MongoDB, so we avoid pulling all the data over the network. Processing in JavaScript is fine for small results, but for thousands or millions of documents, the pipeline is way faster.

13. What do $match, $group, $sort, $project, $limit, and $lookup do?
$match filters documents like a WHERE clause. $group aggregates by a key, like GROUP BY. $sort orders results. $project reshapes documents — picking or computing fields. $limit caps the number of results. $lookup does a left outer join with another collection. These are the building blocks of most pipelines.

Mongoose
14. What is Mongoose? Is it the official MongoDB driver?
Mongoose is an ODM — Object Document Mapper — for MongoDB in Node.js. It's not the official driver, but it's built on top of the official mongodb driver. It adds schemas, validation, middleware hooks, and a nicer API for working with documents as JavaScript objects.

15. What is the difference between Schema and Model in Mongoose?
A schema defines the shape of documents — fields, types, validators, and defaults. A model is the compiled version of the schema — it's the class we use to query and create documents in a specific collection. So schema is the blueprint, model is the working tool.

16. What Mongoose schema options or validators are commonly used?
Common ones are required, default, unique, min and max for numbers, minlength and maxlength for strings, enum for restricted values, match for regex validation, and lowercase or trim for string transformations. We can also define custom validator functions for anything not covered.

17. When does Mongoose validation run by default? How do you enable validators for update operations?
Validation runs automatically on save and on create. But it doesn't run on update or findOneAndUpdate by default — that surprises a lot of people. To enable it, we pass { runValidators: true } in the options. We can also add { new: true } to get the updated document back.

18. What are Mongoose hooks / middleware? What is the difference between pre and post hooks?
Hooks are functions that run before or after specific operations like save, find, or remove. pre runs before — useful for things like hashing a password before save. post runs after — handy for logging or cascading deletes. They give us a clean place to put side effects without cluttering business logic.

19. Why should you avoid arrow functions in some Mongoose hooks and virtuals?
Because arrow functions don't bind their own this. Inside hooks and virtuals, this refers to the document being saved or accessed — that's how we read fields. If we use an arrow function, this becomes the outer scope, and we lose access to the document. So we use regular function declarations there.

20. What does lean() do? When would you use it?
lean() tells Mongoose to return plain JavaScript objects instead of Mongoose documents. It skips the hydration step — so no methods, virtuals, or change tracking. It's much faster and uses less memory, so we use it for read-only queries where we don't need to modify or save the data back.

21. What does populate() do? What are its performance tradeoffs?
populate() replaces a referenced ID with the actual document from another collection — basically a JOIN. It's convenient, but each populate runs an extra query, so deep or many-to-many populates can be slow. For high-performance reads, sometimes embedding the data or using $lookup in an aggregation is better.

22. What are virtual fields in Mongoose? Why do virtuals not always appear in JSON output?
Virtuals are computed fields that aren't stored in the database — like a fullName derived from firstName and lastName. By default, they're not included in toJSON or toObject output, which is why API responses sometimes miss them. We enable them by setting { toJSON: { virtuals: true } } in the schema options.
