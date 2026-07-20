import mongoose from 'mongoose';
import 'dotenv/config';

const taskSchema = new mongoose.Schema({
  title:    String,
  status:   { type: String, enum: ['todo', 'in_progress', 'done'] },
  priority: { type: String, enum: ['low', 'medium', 'high'] },
  dueDate:  Date,
});

// Use a dedicated collection so this lab doesn't affect other exercises
const Task = mongoose.model('LabTask', taskSchema, 'lab_tasks');

const STATUS   = ['todo', 'in_progress', 'done'];
const PRIORITY = ['low', 'medium', 'high'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

async function seed(count = 1000) {
  await Task.deleteMany({});
  const docs = Array.from({ length: count }, (_, i) => ({
    title:    `Task ${i}`,
    status:   rand(STATUS),
    priority: rand(PRIORITY),
    dueDate:  new Date(Date.now() + (Math.random() - 0.5) * 1e10),
  }));
  await Task.insertMany(docs);
  console.log(`✅ Seeded ${count} tasks`);
}

async function explain(label, filter, sort = {}) {
  const q = Task.find(filter);
  if (Object.keys(sort).length) q.sort(sort);
  const stats = await q.explain('executionStats');
  const e = stats.executionStats;
  const stage =
    e.executionStages?.stage ??
    e.executionStages?.inputStage?.stage ??
    '(see full explain)';
  console.log(`\n  [${label}]`);
  console.log(`    Stage:         ${stage}`);
  console.log(`    Docs examined: ${e.totalDocsExamined}`);
  console.log(`    Docs returned: ${e.totalDocsReturned}`);
  console.log(`    Time (ms):     ${e.executionTimeMillis}`);
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hw12');
  await seed(1000);

  // Drop existing indexes (except _id) to get a clean baseline
  await Task.collection.dropIndexes();

  console.log('\n=== BEFORE indexes (COLLSCAN expected) ===');
  await explain('status = todo',          { status: 'todo' });
  await explain('priority = high',        { priority: 'high' });
  await explain('status + sort dueDate',  { status: 'in_progress' }, { dueDate: -1 });

  // Single-field index on status
  await Task.collection.createIndex({ status: 1 });
  console.log('\n📌 Created: { status: 1 }');

  // Compound index on { status, dueDate }
  await Task.collection.createIndex({ status: 1, dueDate: -1 });
  console.log('📌 Created: { status: 1, dueDate: -1 }');

  console.log('\n=== AFTER indexes (IXSCAN expected for status queries) ===');
  await explain('status = todo',          { status: 'todo' });
  await explain('priority = high',        { priority: 'high' }); // still COLLSCAN — no index
  await explain('status + sort dueDate',  { status: 'in_progress' }, { dueDate: -1 });

  // Extra credit: unique index + duplicate key error
  await Task.collection.createIndex({ title: 1 }, { unique: true });
  try {
    await Task.create({ title: 'Task 0', status: 'todo', priority: 'low', dueDate: new Date() });
  } catch (err) {
    console.log('\n✋ Duplicate key error caught:', err.message.slice(0, 80));
  }

  // Extra credit: lean() vs normal Mongoose document performance comparison
  console.log('\n--- lean() vs normal ---');
  console.time('normal');
  await Task.find({ status: 'todo' }).limit(200);
  console.timeEnd('normal');

  console.time('lean');
  await Task.find({ status: 'todo' }).limit(200).lean();
  console.timeEnd('lean');

  console.log('lean() skips Mongoose document hydration → faster for read-only queries');
}

main().catch(console.error).finally(() => mongoose.disconnect());
