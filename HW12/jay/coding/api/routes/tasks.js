// Task 3: Task Management REST API routes (+ task 4 populate on GET /tasks/:id)
const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');

const router = express.Router();

function validateObjectId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: `Invalid task id: ${req.params.id}` });
  }
  next();
}

// GET /tasks?status=&priority=&page=&limit=&sortBy=&order=&search=
router.get('/', async (req, res, next) => {
  try {
    const { status, priority, search, sortBy = 'createdAt', order = 'desc' } = req.query;

    const filter = { deletedAt: null }; // hide soft-deleted tasks
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    // Extra credit: keyword search on title
    if (search) filter.title = { $regex: search, $options: 'i' };

    // Pagination
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);

    // Sorting (only allow known fields)
    const allowedSort = ['createdAt', 'dueDate'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'createdAt';
    const sort = { [sortField]: order === 'asc' ? 1 : -1 };

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Task.countDocuments(filter),
    ]);

    res.json({
      data: tasks,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
});

// GET /tasks/:id  (task 4: populate assignee and project owner)
router.get('/:id', validateObjectId, async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, deletedAt: null })
      .populate('assignee', 'name email role')
      .populate({ path: 'project', select: 'name slug owner', populate: { path: 'owner', select: 'name email' } })
      .lean();
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ data: task });
  } catch (err) {
    next(err);
  }
});

// POST /tasks
router.post('/', async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, assignee, project } = req.body;
    const task = await Task.create({ title, description, status, priority, dueDate, assignee, project });
    res.status(201).json({ data: task });
  } catch (err) {
    next(err);
  }
});

// PATCH /tasks/:id
router.patch('/:id', validateObjectId, async (req, res, next) => {
  try {
    const allowed = ['title', 'description', 'status', 'priority', 'dueDate', 'assignee'];
    const updates = {};
    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key];
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { $set: updates },
      { returnDocument: 'after', runValidators: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ data: task });
  } catch (err) {
    next(err);
  }
});

// DELETE /tasks/:id  (extra credit: soft delete with deletedAt)
router.delete('/:id', validateObjectId, async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task soft-deleted', data: { id: task._id, deletedAt: task.deletedAt } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
