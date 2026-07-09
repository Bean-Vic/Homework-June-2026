require("dotenv").config();

const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("Missing MONGODB_URI. Please create a .env file in the coding folder.");
  process.exit(1);
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return emailRegex.test(value);
        },
        message: "Email format is invalid"
      }
    },
    age: {
      type: Number,
      min: [0, "Age cannot be below 0"],
      max: [150, "Age cannot be above 150"],
      default: 18
    },
    role: {
      type: String,
      enum: ["student", "mentor", "admin"],
      default: "student"
    },
    tags: [String],
    profile: {
      bio: String
    },
    assignment: {
      type: String,
      default: "hw12-mongoose-model"
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.virtual("displayName").get(function () {
  return `${this.name} <${this.email}>`;
});

const User = mongoose.model("Hw12ModelUser", userSchema, "users");

async function main() {
  try {
    await mongoose.connect(uri, { dbName: "hw12_mongoose_model" });
    console.log("1) Connected to MongoDB with Mongoose.");

    await User.deleteMany({ assignment: "hw12-mongoose-model" });
    console.log("2) Removed old model-demo users.");

    await User.init();
    console.log("3) User model indexes are ready.");

    const createdUsers = await User.create([
      {
        name: "Miya Zhang",
        email: "miya.model@example.com",
        age: 24,
        role: "student",
        tags: ["mongodb", "backend"],
        profile: { bio: "Learning MongoDB and Mongoose" }
      },
      {
        name: "Jason Chen",
        email: "jason.model@example.com",
        age: 32,
        role: "mentor",
        tags: ["mentor", "nodejs"],
        profile: { bio: "Backend mentor" }
      },
      {
        name: "Admin User",
        email: "admin.model@example.com",
        age: 40,
        role: "admin",
        tags: ["admin"],
        profile: { bio: "System admin" }
      }
    ]);
    console.log("4) Created at least 3 users:");
    console.log(createdUsers.map((user) => user.toJSON()));

    try {
      await User.create({
        name: "A",
        email: "not-an-email",
        age: 200,
        role: "guest"
      });
    } catch (error) {
      console.log("\n5) Validation errors with invalid data:");
      console.log(error.message);
    }

    const miya = await User.findOne({ email: "miya.model@example.com" });

    await User.findByIdAndUpdate(miya._id, { age: 300 });
    const invalidUpdatedUser = await User.findById(miya._id);
    console.log("\n6) Update without runValidators allowed invalid age:");
    console.log({ name: invalidUpdatedUser.name, age: invalidUpdatedUser.age });

    await User.findByIdAndUpdate(miya._id, { age: 24 }, { runValidators: true });

    try {
      await User.findByIdAndUpdate(
        miya._id,
        { age: 300 },
        { runValidators: true, new: true }
      );
    } catch (error) {
      console.log("\n7) Update with runValidators: true caught the invalid age:");
      console.log(error.message);
    }

    const findResult = await User.find({ age: { $gte: 18 } })
      .select("name email age role displayName")
      .sort({ age: -1 })
      .limit(2)
      .skip(0)
      .lean({ virtuals: true });
    console.log("\n8) find + select + sort + limit + skip + lean:");
    console.log(findResult);

    const findOneResult = await User.findOne({ role: "mentor" }).select("name email role");
    console.log("\n9) findOne result:");
    console.log(findOneResult);

    const updated = await User.findByIdAndUpdate(
      miya._id,
      { role: "mentor", tags: ["mongodb", "mongoose", "updated"] },
      { new: true, runValidators: true }
    );
    console.log("\n10) findByIdAndUpdate result:");
    console.log(updated.toJSON());
  } catch (error) {
    console.error("Something went wrong in userModelDemo.js:");
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log("\n11) Database connection closed safely.");
  }
}

main();
