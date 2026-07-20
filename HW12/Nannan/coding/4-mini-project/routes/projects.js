import { Router } from 'express';
import mongoose from 'mongoose';
import Project from '../models/Project.js';
import Task from '../models/Task.js';

const router = Router();

// POST /projects
router.post('/', async (req, res, next) => {
  try {
    const project = await new Project(req.body).save();
    res.status(201).json(project);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    next(err);
  }
});

// POST /projects/:projectId/tasks
router.post('/:projectId/tasks', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.projectId)) {
      return res.status(400).json({ error: 'Invalid project id' });
    }
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const task = await new Task({ ...req.body, project: project._id }).save();
    res.status(201).json(task);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    next(err);
  }
});

// GET /projects/:projectId — populate owner; extra credit: nested populate for tasks + assignees
router.get('/:projectId', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.projectId)) {
      return res.status(400).json({ error: 'Invalid project id' });
    }
    const project = await Project.findById(req.params.projectId).populate('owner');
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Extra credit: fetch tasks with nested populate on assignee
    const tasks = await Task.find({ project: project._id }).populate('assignee', 'name email role');

    res.json({ ...project.toJSON(), tasks });
  } catch (err) { next(err); }
});

export default router;
