import { Router } from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task.js';

const router = Router();

// GET /tasks/:taskId — populate assignee and project
router.get('/:taskId', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.taskId)) {
      return res.status(400).json({ error: 'Invalid task id' });
    }
    const task = await Task.findById(req.params.taskId)
      .populate('assignee', 'name email role')
      .populate('project', 'name slug');
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) { next(err); }
});

export default router;
