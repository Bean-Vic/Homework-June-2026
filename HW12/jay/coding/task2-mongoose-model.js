// Task 2: Mongoose User Model and Validation
// Run: node task2-mongoose-model.js
require('dotenv').config();
const mongoose = require('mongoose');

function log(step, result) {
  console.log(`\n=== ${step} ===`);
  console.log(JSON.stringify(result, null, 2));
}

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
        message: (props) => `"${props.value}" is not a valid email`,
      },
    },
    age: { type: Number, min: 0, max: 150, default: 18 },
    role: { type: String, enum: ['student', 'mentor', 'admin'], default: 'student' },
    tags: [String],
    profile: {
      bio: String,
    },
  },
  {
    timestamps: true,
    // Extra credit: make virtuals show up in JSON / object output
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Extra credit: virtual field (regular function so `this` is the document)
userSchema.virtual('displayName').get(function () {
  return `${this.name} (${this.role})`;
});

const User = mongoose.model('User', userSchema);

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected via Mongoose');

  // Clean start so the script is repeatable (drop old data AND old indexes,
  // then let Mongoose rebuild the unique index before we insert)
  await User.collection.drop().catch(() => {});
  await User.syncIndexes();

  // 1. Create at least 3 users
  const created = await User.create([
    { name: 'Alice', email: 'ALICE@Example.com', age: 25, role: 'mentor', tags: ['js', 'mongo'] },
    { name: 'Bob', email: 'bob@example.com', tags: ['react'], profile: { bio: 'Hi, I am Bob.' } },
    { name: 'Carol', email: 'carol@example.com', age: 32, role: 'admin' },
  ]);
  log('created users (note lowercased email + default age/role)', created.map((u) => ({
    name: u.name,
    email: u.email,
    age: u.age,
    role: u.role,
  })));

  // 2. Demonstrate validation errors with invalid data
  try {
    await User.create({ name: 'X', email: 'not-an-email', age: 200 });
  } catch (err) {
    log('validation errors on create', Object.fromEntries(
      Object.entries(err.errors).map(([field, e]) => [field, e.message])
    ));
  }

  // 3. Update validators are OFF by default...
  const noValidation = await User.findOneAndUpdate(
    { email: 'bob@example.com' },
    { age: -5 },
    { returnDocument: 'after' }
  );
  log('update WITHOUT runValidators (invalid age -5 slipped through!)', { age: noValidation.age });

  // ...and must be enabled with runValidators: true
  try {
    await User.findOneAndUpdate(
      { email: 'bob@example.com' },
      { age: -5 },
      { returnDocument: 'after', runValidators: true }
    );
  } catch (err) {
    log('update WITH runValidators rejects invalid age', {
      message: err.errors.age.message,
    });
  }
  // repair Bob
  await User.findOneAndUpdate({ email: 'bob@example.com' }, { age: 18 });

  // 4. Query methods tour
  const allSorted = await User.find({})
    .select('name email age -_id')
    .sort({ age: -1 })
    .lean(); // plain JS objects, faster, no Mongoose document overhead
  log('find + select + sort(age desc) + lean', allSorted);

  const page2 = await User.find({}).sort({ name: 1 }).skip(1).limit(1).select('name -_id').lean();
  log('pagination: sort(name) skip(1) limit(1)', page2);

  const alice = await User.findOne({ role: 'mentor' }).select('name role -_id').lean();
  log('findOne role=mentor', alice);

  const updatedById = await User.findByIdAndUpdate(
    created[2]._id,
    { $addToSet: { tags: 'databases' } },
    { returnDocument: 'after', runValidators: true }
  ).select('name tags -_id').lean();
  log('findByIdAndUpdate (add tag)', updatedById);

  // Extra credit: virtual appears in JSON because of toJSON: { virtuals: true }
  const bob = await User.findOne({ email: 'bob@example.com' });
  log('virtual displayName in JSON output', {
    displayName: bob.displayName,
    json: bob.toJSON({ virtuals: true }) && JSON.parse(JSON.stringify(bob)).displayName,
  });

  await mongoose.disconnect();
  console.log('\nDisconnected');
}

main().catch(async (err) => {
  console.error('Script failed:', err);
  await mongoose.disconnect();
  process.exit(1);
});
