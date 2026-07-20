import mongoose from 'mongoose';
import 'dotenv/config';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: (p) => `"${p.value}" is not a valid email`,
      },
    },
    age:  { type: Number, min: 0, max: 150, default: 18 },
    role: { type: String, enum: ['student', 'mentor', 'admin'], default: 'student' },
    tags: [String],
    profile: { bio: String },
  },
  { timestamps: true }
);

// Extra credit: virtual displayName
userSchema.virtual('displayName').get(function () {
  return `${this.name} (${this.role})`;
});
// Extra credit: expose virtuals in JSON output
userSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('User', userSchema);

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hw12');
  console.log('✅ Connected\n');
  await User.deleteMany({ tags: 'demo' });

  // Create at least 3 users
  const users = await User.insertMany([
    { name: 'Alice', email: 'alice.mg@example.com', age: 25, role: 'admin',   tags: ['demo'] },
    { name: 'Bob',   email: 'bob.mg@example.com',   age: 20, role: 'student', tags: ['demo'], profile: { bio: 'Student at VIc' } },
    { name: 'Carol', email: 'carol.mg@example.com', age: 30, role: 'mentor',  tags: ['demo'] },
  ]);
  console.log('Created:', users.map((u) => u.displayName).join(', '));

  // Demonstrate validation errors with invalid data
  console.log('\n--- Validation Error Demo ---');
  try {
    await new User({ name: 'X', email: 'not-valid', age: -5, role: 'hacker' }).save();
  } catch (err) {
    console.log('Validation errors caught:', Object.keys(err.errors).join(', '));
  }

  // Without runValidators — update bypasses validation
  await User.findByIdAndUpdate(users[0]._id, { $set: { age: 200 } });
  const noValidate = await User.findById(users[0]._id).lean();
  console.log(`\nWithout runValidators: age=${noValidate.age} saved with no error`);

  // With runValidators — catches invalid value
  try {
    await User.findByIdAndUpdate(
      users[0]._id,
      { $set: { age: 200 } },
      { runValidators: true }
    );
  } catch (err) {
    console.log('With runValidators: caught -', err.message.slice(0, 60));
  }

  // find + select + sort + limit + skip + lean
  const list = await User.find({ tags: 'demo' })
    .select('name email role')
    .sort({ name: 1 })
    .limit(2)
    .skip(1)
    .lean();
  console.log('\nfind lean result:', list.map((u) => u.name).join(', '));

  // findOne
  const one = await User.findOne({ email: 'carol.mg@example.com' });
  console.log('findOne displayName:', one.displayName);

  // findByIdAndUpdate
  const updated = await User.findByIdAndUpdate(
    users[1]._id,
    { $set: { role: 'mentor' } },
    { new: true }
  );
  console.log('findByIdAndUpdate Bob role:', updated.role);
}

main().catch(console.error).finally(() => mongoose.disconnect());
