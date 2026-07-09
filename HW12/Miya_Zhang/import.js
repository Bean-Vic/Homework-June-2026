require("dotenv").config();

const fs = require("fs/promises");
const path = require("path");
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

function getArg(name) {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) return null;
  return process.argv[index + 1];
}

const filePath = getArg("file");
const type = getArg("type");
const dryRun = process.argv.includes("--dry-run");

if (!filePath || !type) {
  console.error("Usage: node import.js --file data/tasks.json --type tasks [--dry-run]");
  process.exit(1);
}

if (!uri && !dryRun) {
  console.error("Missing MONGODB_URI. Please create a .env file in the coding folder.");
  process.exit(1);
}

async function readInput(file) {
  let raw;
  try {
    raw = await fs.readFile(file, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`File does not exist: ${file}`);
    }
    throw error;
  }

  try {
    if (file.endsWith(".ndjson")) {
      return raw
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => JSON.parse(line));
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error("Input JSON must be an array.");
    }
    return parsed;
  } catch (error) {
    throw new Error(`Invalid JSON format: ${error.message}`);
  }
}

function cleanUser(record) {
  const failed = [];
  const name = typeof record.name === "string" ? record.name.trim() : "";
  const email = typeof record.email === "string" ? record.email.trim().toLowerCase() : "";

  if (!name) failed.push("missing required field: name");
  if (!email) failed.push("missing required field: email");

  return {
    failed,
    key: email,
    doc: {
      name,
      email,
      role: ["student", "mentor", "admin"].includes(record.role) ? record.role : "student",
      importedAt: new Date(),
      source: "hw12-import"
    }
  };
}

function cleanTask(record) {
  const failed = [];
  const title = typeof record.title === "string" ? record.title.trim() : "";
  const externalId = record.externalId ? String(record.externalId).trim() : "";

  if (!title) failed.push("missing required field: title");
  if (!externalId) failed.push("missing required field: externalId");

  return {
    failed,
    key: externalId,
    doc: {
      externalId,
      title,
      description: record.description || "",
      status: ["todo", "in_progress", "done"].includes(record.status) ? record.status : "todo",
      priority: ["low", "medium", "high"].includes(record.priority) ? record.priority : "medium",
      dueDate: record.dueDate ? new Date(record.dueDate) : null,
      importedAt: new Date(),
      source: "hw12-import"
    }
  };
}

function cleanEvent(record) {
  const failed = [];
  const externalId = record.externalId ? String(record.externalId).trim() : "";
  const eventType = typeof record.type === "string" ? record.type.trim() : "";

  if (!externalId) failed.push("missing required field: externalId");
  if (!eventType) failed.push("missing required field: type");

  return {
    failed,
    key: externalId,
    doc: {
      externalId,
      type: eventType,
      payload: record.payload || {},
      importedAt: new Date(),
      source: "hw12-import"
    }
  };
}

function cleanRecord(record, importType) {
  if (importType === "users") return cleanUser(record);
  if (importType === "tasks") return cleanTask(record);
  if (importType === "events") return cleanEvent(record);
  throw new Error("Invalid --type. Use users, tasks, or events.");
}

async function main() {
  const input = await readInput(filePath);
  const seenKeys = new Set();
  const validDocs = [];
  const failedRecords = [];
  let skippedCount = 0;

  for (const record of input) {
    const result = cleanRecord(record, type);

    if (result.failed.length > 0) {
      failedRecords.push({ record, errors: result.failed });
      continue;
    }

    if (seenKeys.has(result.key)) {
      skippedCount += 1;
      failedRecords.push({ record, errors: ["duplicate record in input file"] });
      continue;
    }

    seenKeys.add(result.key);
    validDocs.push(result);
  }

  if (failedRecords.length > 0) {
    await fs.writeFile(
      path.join(process.cwd(), "failed-records.json"),
      JSON.stringify(failedRecords, null, 2)
    );
  }

  if (dryRun) {
    console.log("Dry run mode. Nothing was written to MongoDB.");
    console.log({
      totalRead: input.length,
      validCount: validDocs.length,
      skippedCount,
      failedCount: failedRecords.length
    });
    return;
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("hw12_batch_import");
    const collection = db.collection(`imported_${type}`);

    const keyField = type === "users" ? "email" : "externalId";
    await collection.createIndex({ [keyField]: 1 }, { unique: true });

    const operations = validDocs.map((item) => ({
      updateOne: {
        filter: { [keyField]: item.key },
        update: { $setOnInsert: item.doc },
        upsert: true
      }
    }));

    let insertedCount = 0;
    let existingSkippedCount = 0;

    if (operations.length > 0) {
      const result = await collection.bulkWrite(operations, { ordered: false });
      insertedCount = result.upsertedCount || 0;
      existingSkippedCount = result.matchedCount || 0;
    }

    const summary = {
      type,
      totalRead: input.length,
      insertedCount,
      skippedCount: skippedCount + existingSkippedCount,
      failedCount: failedRecords.length,
      failedRecordsFile: failedRecords.length > 0 ? "failed-records.json" : null
    };

    console.log("Import summary:");
    console.log(summary);
  } finally {
    await client.close();
    console.log("Database connection closed safely.");
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
