import { Router } from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task.js';

const router = Router();

// GET /tasks — filter by status, priority, pagination, keyword search
router.get('/', async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 10, sortBy = 'createdAt', search } = req.query;
    const filter = { deletedAt: null };
    if (status)   filter.status = status;
    if (priority) filter.priority = priority;
    // Extra credit: keyword search on title with $regex
    if (search)   filter.title = { $regex: search, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [data, total] = await Promise.all([
      Task.find(filter).sort({ [sortBy]: 1 }).limit(parseInt(limit)).skip(skip),
      Task.countDocuments(filter),
    ]);
    res.json({ total, page: parseInt(page), limit: parseInt(limit), data });
  } catch (err) { next(err); }
});

// GET /tasks/:id
router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid task id' });
    }
    const task = await Task.findOne({ _id: req.params.id, deletedAt: null });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) { next(err); }
});

// POST /tasks
router.post('/', async (req, res, next) => {
  try {
    const task = await new Task(req.body).save();
    res.status(201).json(task);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    next(err);
  }
});

// PATCH /tasks/:id
router.patch('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid task id' });
    }
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    next(err);
  }
});

// DELETE /tasks/:id — soft delete (extra credit)
router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid task id' });
    }
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task soft-deleted', id: task._id });
  } catch (err) { next(err); }
});

export default router;
