require("dotenv").config();

const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("Missing MONGODB_URI. Please create a .env file in the coding folder.");
  process.exit(1);
}

const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    console.log("1) Connected to MongoDB with native driver.");

    const db = client.db("hw12_native_driver");
    const collectionName = "users";

    const existing = await db.listCollections({ name: collectionName }).toArray();
    if (existing.length === 0) {
      await db.createCollection(collectionName);
      console.log("2) Created users collection.");
    } else {
      console.log("2) Users collection already exists.");
    }

    const users = db.collection(collectionName);

    await users.deleteMany({ assignment: "hw12-native" });
    console.log("3) Removed old HW12 native-driver test data.");

    await users.createIndex({ email: 1 }, { unique: true });
    console.log("4) Extra credit: unique index created on email.");

    const insertResult = await users.insertMany([
      {
        name: "Miya Zhang",
        age: 24,
        role: "student",
        email: "miya.native@example.com",
        assignment: "hw12-native"
      },
      {
        name: "Anna Lee",
        age: 19,
        role: "student",
        email: "anna.native@example.com",
        assignment: "hw12-native"
      },
      {
        name: "Jason Chen",
        age: 31,
        role: "mentor",
        email: "jason.native@example.com",
        assignment: "hw12-native"
      },
      {
        name: "Lily Wang",
        age: 17,
        role: "student",
        email: "lily.native@example.com",
        assignment: "hw12-native"
      },
      {
        name: "Tom Brown",
        age: 28,
        role: "developer",
        email: "tom.native@example.com",
        assignment: "hw12-native"
      },
      {
        name: "Delete Me",
        age: 22,
        role: "student",
        email: "delete.native@example.com",
        assignment: "hw12-native"
      }
    ]);

    console.log("5) Inserted users with insertMany:");
    console.log(insertResult.insertedIds);

    const adultUsers = await users.find({ age: { $gte: 18 } }).toArray();
    console.log("\n6) Query result - users age greater than or equal to 18:");
    console.log(adultUsers);

    const studentOrMentor = await users
      .find({ role: { $in: ["student", "mentor"] } })
      .toArray();
    console.log("\n7) Query result - users with role student or mentor:");
    console.log(studentOrMentor);

    const usersWithEmail = await users.find({ email: { $exists: true } }).toArray();
    console.log("\n8) Query result - users with email field:");
    console.log(usersWithEmail);

    const updateResult = await users.updateOne(
      { email: "miya.native@example.com" },
      { $set: { role: "mentor", updatedByScript: true } }
    );
    console.log("\n9) Update one user with $set:");
    console.log(updateResult);

    const updatedUser = await users.findOne({ email: "miya.native@example.com" });
    console.log("\n10) Updated user:");
    console.log(updatedUser);

    const deleteResult = await users.deleteOne({ email: "delete.native@example.com" });
    console.log("\n11) Deleted one test user:");
    console.log(deleteResult);

    try {
      await users.insertOne({
        name: "Duplicate Email User",
        age: 21,
        role: "student",
        email: "miya.native@example.com",
        assignment: "hw12-native"
      });
    } catch (error) {
      console.log("\n12) Extra credit: duplicate email insertion failed as expected.");
      console.log(error.message);
    }
  } catch (error) {
    console.error("Something went wrong in nativeCrud.js:");
    console.error(error);
  } finally {
    await client.close();
    console.log("\n13) Database connection closed safely.");
  }
}

main();
