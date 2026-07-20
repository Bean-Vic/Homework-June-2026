import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title:    { type: String, required: true, trim: true },
    status:   { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    project:  { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    dueDate:  { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);
