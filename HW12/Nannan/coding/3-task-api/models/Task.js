import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status:      { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
    priority:    { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    dueDate:     { type: Date },
    deletedAt:   { type: Date, default: null }, // soft delete (extra credit)
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);
