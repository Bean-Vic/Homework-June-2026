// Task 4: Mini project routes with populate
const express = require('express');
const mongoose = require('mongoose');
const Project = require('../models/Project');
const Task = require('../models/Task');

const router = express.Router();

function badId(res, id) {
  return res.status(400).json({ error: `Invalid id: ${id}` });
}

// POST /projects
router.post('/', async (req, res, next) => {
  try {
    const { name, owner } = req.body;
    const project = await Project.create({ name, owner }); // slug generated in pre('save')
    res.status(201).json({ data: project });
  } catch (err) {
    next(err);
  }
});

// POST /projects/:projectId/tasks
router.post('/:projectId/tasks', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    if (!mongoose.isValidObjectId(projectId)) return badId(res, projectId);

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const { title, description, status, priority, dueDate, assignee } = req.body;
    const task = await Task.create({ title, description, status, priority, dueDate, assignee, project: projectId });
    res.status(201).json({ data: task });
  } catch (err) {
    next(err);
  }
});

// GET /projects/:projectId — populate owner, taskCount, and nested tasks + assignees
router.get('/:projectId', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    if (!mongoose.isValidObjectId(projectId)) return badId(res, projectId);

    const project = await Project.findById(projectId)
      .populate('owner', 'name email role')
      .populate('taskCount')
      // Extra credit: nested populate — project tasks and each task's assignee
      .populate({
        path: 'tasks',
        match: { deletedAt: null },
        select: 'title status priority dueDate assignee',
        populate: { path: 'assignee', select: 'name email' },
      });

    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ data: project });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
