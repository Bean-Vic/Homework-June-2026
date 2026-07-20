import { MongoClient } from 'mongodb';
import 'dotenv/config';

const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');

async function main() {
  await client.connect();
  console.log('✅ Connected to MongoDB');

  const col = client.db('hw12').collection('users');

  // Extra credit: unique index on email
  await col.createIndex({ email: 1 }, { unique: true });
  console.log('📌 Unique index on email created');

  // Clean up test data from previous runs
  await col.deleteMany({ _testRun: true });

  // Step 3 — insertMany (at least 5 users)
  const insertResult = await col.insertMany([
    { name: 'Alice', email: 'alice@hw12.com', age: 25, role: 'admin',   _testRun: true },
    { name: 'Bob',   email: 'bob@hw12.com',   age: 17, role: 'student', _testRun: true },
    { name: 'Carol', email: 'carol@hw12.com', age: 22, role: 'mentor',  _testRun: true },
    { name: 'Dave',  email: 'dave@hw12.com',  age: 19, role: 'student', _testRun: true },
    { name: 'Eve',   email: 'eve@hw12.com',   age: 30, role: 'mentor',  _testRun: true },
  ]);
  console.log(`\n📥 Inserted ${insertResult.insertedCount} users`);

  // Step 4a — age >= 18
  const adults = await col.find({ age: { $gte: 18 }, _testRun: true }).toArray();
  console.log(`\n🔍 age >= 18: ${adults.map((u) => u.name).join(', ')}`);

  // Step 4b — role in ['student', 'mentor']
  const byRole = await col
    .find({ role: { $in: ['student', 'mentor'] }, _testRun: true })
    .toArray();
  console.log(`🔍 role student|mentor: ${byRole.map((u) => u.name).join(', ')}`);

  // Step 4c — email exists
  const withEmail = await col
    .find({ email: { $exists: true }, _testRun: true })
    .toArray();
  console.log(`🔍 email $exists: ${withEmail.map((u) => u.name).join(', ')}`);

  // Step 5 — updateOne with $set
  const updateResult = await col.updateOne(
    { email: 'alice@hw12.com' },
    { $set: { age: 26, updatedAt: new Date() } }
  );
  console.log(`\n✏️  Updated ${updateResult.modifiedCount} user (Alice age → 26)`);

  // Step 6 — deleteOne
  const deleteResult = await col.deleteOne({ email: 'eve@hw12.com' });
  console.log(`🗑️  Deleted ${deleteResult.deletedCount} user (Eve)`);

  // Extra credit — demonstrate duplicate email error
  console.log('\n⚡ Attempting duplicate email insertion...');
  try {
    await col.insertOne({ name: 'Alice Clone', email: 'alice@hw12.com', _testRun: true });
  } catch (err) {
    console.log('✋ Duplicate key error caught:', err.message.slice(0, 80));
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await client.close();
    console.log('\n🔒 Connection closed');
  });
