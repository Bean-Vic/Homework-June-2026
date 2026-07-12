// Task 7: Index and Query Performance Lab
// Run: node task7-index-lab.js
require('dotenv').config();
const mongoose = require('mongoose');

const SEED_COUNT = 5000;
const STATUSES = ['todo', 'in_progress', 'done'];
const PRIORITIES = ['low', 'medium', 'high'];
const DAY = 24 * 60 * 60 * 1000;

const perfTaskSchema = new mongoose.Schema(
  {
    externalId: String,
    title: String,
    status: String,
    priority: String,
    dueDate: Date,
  },
  { autoIndex: false, collection: 'perf_tasks' }
);
const PerfTask = mongoose.model('PerfTask', perfTaskSchema);

// Walk the winning plan tree and collect stage names, e.g. FETCH -> IXSCAN
function planStages(plan) {
  const stages = [];
  let node = plan;
  while (node) {
    stages.push(node.stage + (node.indexName ? `(${node.indexName})` : ''));
    node = node.inputStage || (node.inputStages && node.inputStages[0]);
  }
  return stages.join(' -> ');
}

async function explainQuery(label, filter, sort) {
  let q = PerfTask.find(filter);
  if (sort) q = q.sort(sort);
  const out = await q.explain('executionStats');
  const es = out.executionStats;
  const row = {
    query: label,
    plan: planStages(out.queryPlanner.winningPlan),
    nReturned: es.nReturned,
    docsExamined: es.totalDocsExamined,
    keysExamined: es.totalKeysExamined,
    ms: es.executionTimeMillis,
  };
  console.log(row);
  return row;
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = PerfTask.collection;

  // ----- 1. Seed -----
  await col.drop().catch(() => {});
  const docs = [];
  for (let i = 0; i < SEED_COUNT; i++) {
    docs.push({
      externalId: `PERF-${i}`,
      title: `Task ${i}`,
      status: STATUSES[i % 3],
      priority: PRIORITIES[i % 3],
      dueDate: new Date(Date.now() + (i - SEED_COUNT / 2) * (DAY / 24)),
    });
  }
  await col.insertMany(docs);
  console.log(`Seeded ${SEED_COUNT} documents into perf_tasks\n`);

  const dueSoon = { $gte: new Date(), $lte: new Date(Date.now() + 30 * DAY) };

  // ----- 2. Queries BEFORE any index (expect COLLSCAN) -----
  console.log('===== BEFORE indexes (expect COLLSCAN, docsExamined = 5000) =====');
  await explainQuery('status=todo', { status: 'todo' });
  await explainQuery('priority=high', { priority: 'high' });
  await explainQuery('status=todo + dueDate range, sort dueDate desc',
    { status: 'todo', dueDate: dueSoon }, { dueDate: -1 });

  // ----- 3. Single-field index on status -----
  await col.createIndex({ status: 1 });
  console.log('\n===== AFTER single-field index { status: 1 } =====');
  await explainQuery('status=todo', { status: 'todo' });
  await explainQuery('priority=high (no index for this field -> still COLLSCAN)', { priority: 'high' });

  // ----- 4. Compound index { status: 1, dueDate: -1 } -----
  await col.createIndex({ status: 1, dueDate: -1 });
  console.log('\n===== AFTER compound index { status: 1, dueDate: -1 } =====');
  await explainQuery('status=todo + dueDate range, sort dueDate desc (index does filter AND sort)',
    { status: 'todo', dueDate: dueSoon }, { dueDate: -1 });
  // Field order matters: the compound index starts with status, so a query
  // that filters only on dueDate cannot use it (no index prefix match).
  await explainQuery('dueDate range ONLY (cannot use compound index -> COLLSCAN)',
    { dueDate: dueSoon });

  // ----- Extra credit 1: unique index + duplicate key error -----
  console.log('\n===== Extra: unique index on externalId =====');
  await col.createIndex({ externalId: 1 }, { unique: true });
  try {
    await col.insertOne({ externalId: 'PERF-0', title: 'dup' });
  } catch (err) {
    console.log('Duplicate insert rejected:', { code: err.code, keyValue: err.keyValue });
  }

  // ----- Extra credit 2: lean() vs full Mongoose documents -----
  console.log('\n===== Extra: lean() vs hydrated Mongoose documents (read 2000 docs x5) =====');
  const t1 = process.hrtime.bigint();
  for (let i = 0; i < 5; i++) await PerfTask.find({ status: 'todo' }).limit(2000);
  const t2 = process.hrtime.bigint();
  for (let i = 0; i < 5; i++) await PerfTask.find({ status: 'todo' }).limit(2000).lean();
  const t3 = process.hrtime.bigint();
  console.log({
    hydratedMs: Number(t2 - t1) / 1e6,
    leanMs: Number(t3 - t2) / 1e6,
  });

  await mongoose.disconnect();
  console.log('\nDone');
}

main().catch(async (err) => {
  console.error('Lab failed:', err);
  await mongoose.disconnect();
  process.exit(1);
});
