// Task 1: MongoDB Native Driver CRUD Script
// Run: node task1-native-crud.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

function log(step, result) {
  console.log(`\n=== ${step} ===`);
  console.log(JSON.stringify(result, null, 2));
}

async function main() {
  if (!uri) throw new Error('MONGODB_URI is not set in .env');

  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(); // db name comes from the URI path
    const users = db.collection('users');

    // Start from a clean collection so the script is repeatable
    await users.deleteMany({});

    // 1. Insert at least 5 users
    const insertResult = await users.insertMany([
      { name: 'Alice', email: 'alice@example.com', age: 25, role: 'student' },
      { name: 'Bob', email: 'bob@example.com', age: 17, role: 'student' },
      { name: 'Carol', email: 'carol@example.com', age: 32, role: 'mentor' },
      { name: 'David', email: 'david@example.com', age: 41, role: 'admin' },
      { name: 'Eve', email: 'eve@example.com', age: 19, role: 'mentor' },
      { name: 'TestUser', age: 99, role: 'student' }, // no email on purpose
    ]);
    log('insertMany', { insertedCount: insertResult.insertedCount });

    // 2a. Query: age >= 18
    const adults = await users.find({ age: { $gte: 18 } }).toArray();
    log('find age >= 18', adults.map((u) => `${u.name} (${u.age})`));

    // 2b. Query: role in student or mentor
    const studentsOrMentors = await users
      .find({ role: { $in: ['student', 'mentor'] } })
      .toArray();
    log('find role in [student, mentor]', studentsOrMentors.map((u) => `${u.name} (${u.role})`));

    // 2c. Query: email exists
    const withEmail = await users.find({ email: { $exists: true } }).toArray();
    log('find email exists', withEmail.map((u) => `${u.name} <${u.email}>`));

    // 3. Update one user with $set
    const updateResult = await users.updateOne(
      { email: 'bob@example.com' },
      { $set: { age: 18, role: 'mentor' } }
    );
    log('updateOne with $set', {
      matchedCount: updateResult.matchedCount,
      modifiedCount: updateResult.modifiedCount,
    });
    const bob = await users.findOne({ email: 'bob@example.com' });
    log('Bob after update', bob);

    // 4. Delete one test user
    const deleteResult = await users.deleteOne({ name: 'TestUser' });
    log('deleteOne TestUser', { deletedCount: deleteResult.deletedCount });

    // Extra credit: unique index on email + duplicate insertion demo
    const indexName = await users.createIndex({ email: 1 }, { unique: true, sparse: true });
    log('createIndex unique email', { indexName });

    try {
      await users.insertOne({ name: 'Alice Clone', email: 'alice@example.com', age: 30 });
    } catch (err) {
      log('duplicate email insert rejected', {
        code: err.code, // 11000 = duplicate key error
        message: err.message,
      });
    }

    const finalUsers = await users.find({}).toArray();
    log('final users', finalUsers.map((u) => u.name));
  } finally {
    // 5. Close the connection safely, even if something above threw
    await client.close();
    console.log('\nConnection closed');
  }
}

main().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});
