import { readFile, writeFile } from 'fs/promises';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { resolve } from 'path';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

function getArg(args, flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : undefined;
}

const args   = process.argv.slice(2);
const file   = getArg(args, '--file');
const type   = getArg(args, '--type');
const dryRun = args.includes('-dry-run');

if (!file || !type) {
  console.error('Usage: node import.js --file <file> --type <users|tasks> [-dry-run]');
  process.exit(1);
}

const REQUIRED = { users: ['name', 'email', 'role'], tasks: ['title', 'status', 'priority'] };
const DEDUP_KEY = { users: 'email', tasks: 'externalId' };

function validate(record, t) {
  for (const f of REQUIRED[t] || []) {
    if (!record[f] || String(record[f]).trim() === '') return `Missing required field: "${f}"`;
  }
  return null;
}

async function loadJSON(filePath) {
  const abs = resolve(filePath);
  const raw = await readFile(abs, 'utf8');
  return JSON.parse(raw);
}

// Extra credit: stream NDJSON files
async function loadNDJSON(filePath) {
  const abs = resolve(filePath);
  const rl = createInterface({ input: createReadStream(abs), crlfDelay: Infinity });
  const records = [];
  for await (const line of rl) {
    if (line.trim()) records.push(JSON.parse(line));
  }
  return records;
}

async function main() {
  let records;
  try {
    records = file.endsWith('.ndjson') ? await loadNDJSON(file) : await loadJSON(file);
  } catch (err) {
    if (err.code === 'ENOENT') { console.error(`File not found: ${file}`); process.exit(1); }
    console.error('Invalid file format:', err.message);
    process.exit(1);
  }

  const dedupKey = DEDUP_KEY[type];
  const seen = new Set();
  const toInsert = [];
  const failed = [];
  let skipped = 0;

  for (const record of records) {
    const err = validate(record, type);
    if (err) { failed.push({ record, reason: err }); continue; }

    const key = dedupKey && record[dedupKey];
    if (key && seen.has(key)) { skipped++; continue; }
    if (key) seen.add(key);
    toInsert.push(record);
  }

  console.log(`\n📦 Import Summary${dryRun ? ' (DRY RUN)' : ''}`);
  console.log(`  Total:         ${records.length}`);
  console.log(`  To insert:     ${toInsert.length}`);
  console.log(`  Skipped (dup): ${skipped}`);
  console.log(`  Failed:        ${failed.length}`);

  if (failed.length > 0) {
    const failPath = resolve('./failed-records.json');
    await writeFile(failPath, JSON.stringify(failed, null, 2));
    console.log(`\n⚠️  Failed records written to: ${failPath}`);
  }

  if (dryRun) { console.log('\n🔵 Dry run — no data written.'); return; }

  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
  try {
    await client.connect();
    const col = client.db('hw12').collection(type);
    let inserted = 0;
    if (toInsert.length > 0) {
      try {
        const result = await col.insertMany(toInsert, { ordered: false });
        inserted = result.insertedCount;
      } catch (err) {
        inserted = err.result?.insertedCount ?? 0;
        for (const e of err.writeErrors || []) {
          failed.push({ record: toInsert[e.index], reason: e.errmsg });
        }
      }
    }
    console.log(`\n✅ Inserted: ${inserted}`);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
