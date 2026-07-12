// Task 6: Batch Import Job
// Usage:
//   node import.js --file data/users.json --type users
//   node import.js --file data/tasks.json --type tasks
//   node import.js --file data/events.ndjson --type events
//   node import.js --file data/users.json --type users --dry-run
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs/promises');
const { createReadStream } = require('fs');
const readline = require('readline');
const path = require('path');
const { parseArgs } = require('node:util');
const { MongoClient } = require('mongodb');

// ---------- CLI arguments ----------
const { values: args } = parseArgs({
  options: {
    file: { type: 'string' },
    type: { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
  },
});

const TYPES = {
  users: { collection: 'import_users', dedupeKey: 'email' },
  tasks: { collection: 'import_tasks', dedupeKey: 'externalId' },
  events: { collection: 'import_events', dedupeKey: 'externalId' },
};

// ---------- validation / cleaning per type ----------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanRecord(type, raw) {
  // returns { record } on success or { error } on validation failure
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    return { error: 'record is not an object' };
  }
  const rec = { ...raw };
  // trim all string fields
  for (const [k, v] of Object.entries(rec)) {
    if (typeof v === 'string') rec[k] = v.trim();
  }

  if (type === 'users') {
    if (!rec.name) return { error: 'missing required field: name' };
    if (!rec.email) return { error: 'missing required field: email' };
    rec.email = rec.email.toLowerCase();
    if (!EMAIL_RE.test(rec.email)) return { error: `invalid email: ${rec.email}` };
    if (rec.age !== undefined && (typeof rec.age !== 'number' || rec.age < 0 || rec.age > 150)) {
      return { error: `invalid age: ${rec.age}` };
    }
  } else if (type === 'tasks') {
    if (!rec.externalId) return { error: 'missing required field: externalId' };
    if (!rec.title) return { error: 'missing required field: title' };
    if (rec.status && !['todo', 'in_progress', 'done'].includes(rec.status)) {
      return { error: `invalid status: ${rec.status}` };
    }
    if (rec.priority && !['low', 'medium', 'high'].includes(rec.priority)) {
      return { error: `invalid priority: ${rec.priority}` };
    }
    if (rec.dueDate) {
      const d = new Date(rec.dueDate);
      if (Number.isNaN(d.getTime())) return { error: `invalid dueDate: ${rec.dueDate}` };
      rec.dueDate = d;
    }
  } else if (type === 'events') {
    if (!rec.externalId) return { error: 'missing required field: externalId' };
    if (!rec.eventType) return { error: 'missing required field: eventType' };
  }

  return { record: rec };
}

// ---------- file readers ----------
async function readJsonFile(filePath) {
  let text;
  try {
    text = await fs.readFile(filePath, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') throw new Error(`File does not exist: ${filePath}`);
    throw err;
  }
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw new Error(`Invalid JSON in ${filePath}: ${err.message}`);
  }
  if (!Array.isArray(parsed)) throw new Error('Expected a JSON array of records');
  return parsed.map((raw, i) => ({ line: i + 1, raw }));
}

// Extra credit: stream NDJSON line by line (works for very large files
// because we never load the whole file into memory)
async function readNdjsonFile(filePath) {
  try {
    await fs.access(filePath);
  } catch {
    throw new Error(`File does not exist: ${filePath}`);
  }
  const rl = readline.createInterface({
    input: createReadStream(filePath, 'utf8'),
    crlfDelay: Infinity,
  });
  const records = [];
  let lineNo = 0;
  for await (const line of rl) {
    lineNo += 1;
    if (!line.trim()) continue;
    try {
      records.push({ line: lineNo, raw: JSON.parse(line) });
    } catch (err) {
      records.push({ line: lineNo, raw: line, parseError: `invalid JSON on line ${lineNo}: ${err.message}` });
    }
  }
  return records;
}

// ---------- main ----------
async function main() {
  if (!args.file || !args.type) {
    console.error('Usage: node import.js --file <path> --type <users|tasks|events> [--dry-run]');
    process.exit(1);
  }
  if (!TYPES[args.type]) {
    console.error(`Unknown type "${args.type}". Valid types: ${Object.keys(TYPES).join(', ')}`);
    process.exit(1);
  }

  const { collection: collectionName, dedupeKey } = TYPES[args.type];
  const filePath = path.resolve(__dirname, args.file);
  const dryRun = args['dry-run'];

  console.log(`Importing ${args.type} from ${filePath}${dryRun ? ' (DRY RUN)' : ''}`);

  const rows = filePath.endsWith('.ndjson')
    ? await readNdjsonFile(filePath)
    : await readJsonFile(filePath);

  const failed = [];
  const toInsert = [];
  const seenKeys = new Set(); // in-file duplicate detection
  let skippedDuplicates = 0;

  for (const { line, raw, parseError } of rows) {
    if (parseError) {
      failed.push({ line, raw, reason: parseError });
      continue;
    }
    const { record, error } = cleanRecord(args.type, raw);
    if (error) {
      failed.push({ line, raw, reason: error });
      continue;
    }
    const key = record[dedupeKey];
    if (seenKeys.has(key)) {
      skippedDuplicates += 1;
      continue;
    }
    seenKeys.add(key);
    toInsert.push(record);
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  let insertedCount = 0;
  let freshCount = 0;

  try {
    const col = client.db().collection(collectionName);
    await col.createIndex({ [dedupeKey]: 1 }, { unique: true });

    // de-duplicate against records already in the database
    const existing = await col
      .find({ [dedupeKey]: { $in: [...seenKeys] } })
      .project({ [dedupeKey]: 1 })
      .toArray();
    const existingKeys = new Set(existing.map((doc) => doc[dedupeKey]));
    const fresh = toInsert.filter((r) => !existingKeys.has(r[dedupeKey]));
    skippedDuplicates += toInsert.length - fresh.length;
    freshCount = fresh.length;

    if (dryRun) {
      console.log(`[dry-run] would insert ${fresh.length} record(s) into "${collectionName}"`);
    } else if (fresh.length > 0) {
      // bulkWrite with ordered:false keeps going after individual failures
      const ops = fresh.map((doc) => ({ insertOne: { document: { ...doc, importedAt: new Date() } } }));
      try {
        const result = await col.bulkWrite(ops, { ordered: false });
        insertedCount = result.insertedCount;
      } catch (err) {
        // partial failure: some inserted, some failed (e.g. duplicate key race)
        insertedCount = err.result?.insertedCount ?? 0;
        for (const we of err.writeErrors ?? []) {
          failed.push({ raw: fresh[we.index], reason: we.errmsg });
        }
      }
    }
  } finally {
    await client.close();
  }

  // write failed records for later inspection
  const failedPath = path.join(__dirname, 'failed-records.json');
  if (failed.length > 0) {
    await fs.writeFile(failedPath, JSON.stringify(failed, null, 2));
  }

  console.log('\n===== Import Summary =====');
  console.log(`total records in file : ${rows.length}`);
  console.log(`inserted              : ${dryRun ? `0 (dry-run: would insert ${freshCount})` : insertedCount}`);
  console.log(`skipped (duplicates)  : ${skippedDuplicates}`);
  console.log(`failed (invalid)      : ${failed.length}${failed.length ? ` -> ${failedPath}` : ''}`);
}

main().catch((err) => {
  console.error('Import failed:', err.message);
  process.exit(1);
});
