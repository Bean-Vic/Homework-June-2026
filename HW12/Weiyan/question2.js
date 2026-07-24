require('dotenv').config();
const mongoose = require('mongoose');

// 1. Define the Schema
const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'], 
      trim: true, 
      minLength: [2, 'Name must be at least 2 characters long'] 
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'], 
      unique: true, 
      lowercase: true,
      validate: {
        validator: function(value) {
          return /^\S+@\S+\.\S+$/.test(value);
        },
        message: 'Please provide a valid email address'
      }
    },
    age: { 
      type: Number, 
      min: [0, 'Age cannot be negative'], 
      max: [150, 'Age cannot exceed 150'], 
      default: 18 
    },
    role: { 
      type: String, 
      enum: ['student', 'mentor', 'admin'], 
      default: 'student' 
    },
    tags: [{ type: String }],
    profile: {
      bio: { type: String }
    }
  },
  { 
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

// ==========================================
// MAIN FUNCTION
// ==========================================
async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully!\n");

    // Clear the database for reruns
    await User.deleteMany({});

    // 2. Create at least 3 users
    console.log("--- Creating Users ---");
    const users = await User.create([
      { name: "A. Steve ", email: "ALICE@example.com", age: 20, role: "student", tags: ["tech", "design"] },
      { name: "Bobby", email: "bobby@example.com", age: 30, role: "mentor", profile: { bio: "Senior Dev" } },
      { name: "Herman", email: "Herman@example.com", age: 22 },
      { name: "Lucky", email: "Lucky@example.com", age: 18, role: "admin" }
    ]);
    console.log(`Successfully created ${users.length} users.\n`);

    // 3. Demonstrate validation errors
    console.log("--- Testing Creation Validation ---");
    try {
      await User.create({
        name: "E",
        email: "not-an-email",
        age: 200
      });
    } catch (error) {
      console.log("Caught expected validation error on create:");
      // Mongoose errors contain an 'errors' object with specific field violations
      Object.keys(error.errors).forEach(key => {
        console.log(`   - ${key}: ${error.errors[key].message}`);
      });
    }
    console.log();

    // 4. Update Validators
    console.log("--- Testing Update Validation ---");
    const targetUserId = users[0]._id;

    // A) Update WITHOUT runValidators
    await User.findByIdAndUpdate(targetUserId, { age: -50 });
    console.log("Updated age to -50 WITHOUT runValidators.");

    // B) Update WITH runValidators
    try {
      await User.findByIdAndUpdate(
        targetUserId, 
        { age: -50 }, 
        { runValidators: true }
      );
    } catch (error) {
      console.log("Caught expected validation error on update  w/ runValidators: true:");
      console.log(`   - ${error.errors['age'].message}\n`);
    }

    // 5. Demonstrate Query Methods
    console.log("--- Testing Query Methods ---");
    
    // findOne: Get a single specific user
    const singleUser = await User.findOne({ name: "Bobby" });
    console.log(`findOne result: Found ${singleUser.name}`);

    // find + select + sort + skip + limit + lean
    const queryResults = await User.find({ age: { $gte: 18 } })
      .select('name email age role -_id').sort({ age: -1 }).skip(1).limit(2).lean();

    console.log(`Complex Query result (Sorted by age, skipped 1, limited to 2):`);
    console.log(queryResults);

  } catch (error) {
    console.error("Unexpected Error:", error);
  } finally {
    console.log("\nClosing database connection...");
    await mongoose.disconnect();
    console.log("Connection closed.");
  }
}

run();