require("dotenv").config();

const fs = require("fs/promises");
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error(
    "Missing MONGODB_URI. Please create a .env file in the coding folder.",
  );
  process.exit(1);
}

const client = new MongoClient(uri);

const statuses = ["todo", "in_progress", "done"];
const priorities = ["low", "medium", "high"];

function randomItem(items, index) {
  return items[index % items.length];
}

function makeTasks(count) {
  const tasks = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    tasks.push({
      title: `Index lab task ${i + 1}`,
      description: "Generated document for index performance lab",
      status: randomItem(statuses, i),
      priority: randomItem(priorities, i + 1),
      dueDate: new Date(now + (i % 90) * 24 * 60 * 60 * 1000),
      assignment: "hw12-index-lab",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return tasks;
}

function pickStats(explainResult) {
  return {
    nReturned: explainResult.executionStats.nReturned,
    totalDocsExamined: explainResult.executionStats.totalDocsExamined,
    totalKeysExamined: explainResult.executionStats.totalKeysExamined,
    executionTimeMillis: explainResult.executionStats.executionTimeMillis,
  };
}

async function main() {
  try {
    await client.connect();
    const db = client.db("hw12_index_lab");
    const tasks = db.collection("tasks");

    await tasks.deleteMany({ assignment: "hw12-index-lab" });
    try {
      await tasks.dropIndexes();
    } catch (error) {
      // It is okay if no custom indexes exist yet.
    }

    const seedTasks = makeTasks(1200);
    await tasks.insertMany(seedTasks);
    console.log("1) Seeded 1,200 task documents.");

    const statusQuery = { assignment: "hw12-index-lab", status: "todo" };
    const priorityDueDateQuery = {
      assignment: "hw12-index-lab",
      priority: "high",
      dueDate: { $gte: new Date() },
    };
    const compoundQuery = {
      assignment: "hw12-index-lab",
      status: "in_progress",
    };

    const beforeStatus = await tasks
      .find(statusQuery)
      .explain("executionStats");
    const beforePriorityDueDate = await tasks
      .find(priorityDueDateQuery)
      .explain("executionStats");
    const beforeCompound = await tasks
      .find(compoundQuery)
      .sort({ dueDate: -1 })
      .explain("executionStats");

    console.log("\n2) Before indexes:");
    console.log("Status query:", pickStats(beforeStatus));
    console.log(
      "Priority and dueDate query:",
      pickStats(beforePriorityDueDate),
    );
    console.log("Status + dueDate sort query:", pickStats(beforeCompound));

    await tasks.createIndex({ status: 1 });
    console.log("\n3) Created single-field index on status.");

    await tasks.createIndex({ status: 1, dueDate: -1 });
    console.log("4) Created compound index on { status: 1, dueDate: -1 }.");

    const afterStatus = await tasks.find(statusQuery).explain("executionStats");
    const afterPriorityDueDate = await tasks
      .find(priorityDueDateQuery)
      .explain("executionStats");
    const afterCompound = await tasks
      .find(compoundQuery)
      .sort({ dueDate: -1 })
      .explain("executionStats");

    console.log("\n5) After indexes:");
    console.log("Status query:", pickStats(afterStatus));
    console.log("Priority and dueDate query:", pickStats(afterPriorityDueDate));
    console.log("Status + dueDate sort query:", pickStats(afterCompound));

    const duplicateIndexResult = await tasks.createIndex(
      { title: 1 },
      { unique: true, name: "unique_title_index" },
    );
    console.log(
      "\n6) Extra credit: unique index created:",
      duplicateIndexResult,
    );

    try {
      await tasks.insertOne({
        title: "Index lab task 1",
        status: "todo",
        priority: "low",
        dueDate: new Date(),
        assignment: "hw12-index-lab",
      });
    } catch (error) {
      console.log("7) Extra credit: duplicate key error handled:");
      console.log(error.message);
    }

    const results = {
      before: {
        status: pickStats(beforeStatus),
        priorityDueDate: pickStats(beforePriorityDueDate),
        compound: pickStats(beforeCompound),
      },
      after: {
        status: pickStats(afterStatus),
        priorityDueDate: pickStats(afterPriorityDueDate),
        compound: pickStats(afterCompound),
      },
    };

    await fs.writeFile("index-results.json", JSON.stringify(results, null, 2));
    console.log("\n8) Wrote index-results.json.");
  } catch (error) {
    console.error("Something went wrong in indexLab.js:");
    console.error(error);
  } finally {
    await client.close();
    console.log("\n9) Database connection closed safely.");
  }
}

main();
