require('dotenv').config();
const { MongoClient } = require('mongodb');

// 1. Connect using MONGODB_URI from .env
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Connected successfully!");

    // 2. Create/Select the database and 'users' collection
    const db = client.db();
    const usersCollection = db.collection('users');

    // Clean up collection before reruns
    await usersCollection.deleteMany({});

    // 3. Insert at least 5 users
    const sampleUsers = [
      { name: "A. Steve", age: 20, role: "student", email: "asteve@example.com" }, // Matches query
      { name: "Bobby", age: 18, role: "mentor", email: "bobby@example.com" },      // Matches query
      { name: "Herman", age: 15, role: "student", email: "herman@example.com" },
      { name: "Lucky", age: 18, role: "manager", email: "lucky@example.com" },
      { name: "Santa's Little Helper", age: 22, role: "mentor" },
      { name: "TestUser", age: 20, role: "guest", email: "delete@me.com" }
    ];

    console.log("\n--- Step 3: Inserting Users ---");
    const insertResult = await usersCollection.insertMany(sampleUsers);
    console.log(`Inserted ${insertResult.insertedCount} users.`);

    // 4. Query users
    console.log("\n--- Step 4: Querying Users ---");
    const query = {
      age: { $gte: 18 },
      role: { $in: ["student", "mentor"] },
      email: { $exists: true }
    };
    
    const matchedUsers = await usersCollection.find(query).toArray();
    console.log(`Found ${matchedUsers.length} users matching criteria:`);
    console.log(matchedUsers);

    // 5. Update one user with $set
    console.log("\n--- Step 5: Updating a User ---");
    const updateResult = await usersCollection.updateOne(
      { name: "Bobby" },
      { $set: { age: 21 } }
    );
    console.log(`Matched ${updateResult.matchedCount} document(s) and updated ${updateResult.modifiedCount} document(s).`);

    // 6. Delete one test user
    console.log("\n--- Step 6: Deleting a User ---");
    const deleteResult = await usersCollection.deleteOne({ name: "TestUser" });
    console.log(`Deleted ${deleteResult.deletedCount} document(s).`);

  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // 7. Close the connection safely
    console.log("\nClosing database connection...");
    await client.close();
    console.log("Connection closed.");
  }
}

run();