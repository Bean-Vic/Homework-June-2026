import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    role:  { type: String, enum: ['student', 'mentor', 'admin'], default: 'student' },
  },
  { timestamps: true }
);

// Extra credit: virtual fullName
userSchema.virtual('fullName').get(function () {
  return `${this.name} [${this.role}]`;
});
userSchema.set('toJSON', { virtuals: true });

export default mongoose.model('User', userSchema);
