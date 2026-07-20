import { Router } from 'express';
// Reuse Task model from exercise 4 (same database, same collection)
import Task from '../../4-mini-project/models/Task.js';

const router = Router();

function dateMatchStage(query) {
  const { startDate, endDate } = query;
  if (!startDate && !endDate) return {};
  const range = {};
  if (startDate) range.$gte = new Date(startDate);
  if (endDate)   range.$lte = new Date(endDate);
  return { createdAt: range };
}

// GET /reports/tasks/summary
router.get('/tasks/summary', async (req, res, next) => {
  try {
    const [result] = await Task.aggregate([
      { $match: dateMatchStage(req.query) },
      {
        $group: {
          _id: null,
          total:       { $sum: 1 },
          todo:        { $sum: { $cond: [{ $eq: ['$status', 'todo'] },        1, 0] } },
          in_progress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
          done:        { $sum: { $cond: [{ $eq: ['$status', 'done'] },        1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          byStatus: { todo: '$todo', in_progress: '$in_progress', done: '$done' },
        },
      },
    ]);
    res.json(result || { total: 0, byStatus: { todo: 0, in_progress: 0, done: 0 } });
  } catch (err) { next(err); }
});

// GET /reports/tasks/by-project
router.get('/tasks/by-project', async (req, res, next) => {
  try {
    const results = await Task.aggregate([
      { $match: dateMatchStage(req.query) },
      { $group: { _id: '$project', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'projects',
          localField: '_id',
          foreignField: '_id',
          as: 'project',
        },
      },
      { $unwind: { path: '$project', preserveNullAndEmptyArrays: true } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, projectId: '$_id', project: '$project.name', count: 1 } },
    ]);
    res.json(results);
  } catch (err) { next(err); }
});

// GET /reports/tasks/by-assignee
router.get('/tasks/by-assignee', async (req, res, next) => {
  try {
    const results = await Task.aggregate([
      { $match: { assignee: { $exists: true }, ...dateMatchStage(req.query) } },
      { $group: { _id: '$assignee', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'assignee',
        },
      },
      { $unwind: '$assignee' },
      { $sort: { count: -1 } },
      { $project: { _id: 0, assigneeId: '$_id', assignee: '$assignee.name', count: 1 } },
    ]);
    res.json(results);
  } catch (err) { next(err); }
});

// GET /reports/tasks/overdue
router.get('/tasks/overdue', async (req, res, next) => {
  try {
    const results = await Task.aggregate([
      { $match: { dueDate: { $lt: new Date() }, status: { $ne: 'done' } } },
      { $sort: { dueDate: 1 } },
      {
        $project: {
          title: 1,
          status: 1,
          dueDate: 1,
          daysOverdue: {
            $toInt: {
              $divide: [{ $subtract: [new Date(), '$dueDate'] }, 1000 * 60 * 60 * 24],
            },
          },
        },
      },
    ]);
    res.json(results);
  } catch (err) { next(err); }
});

export default router;
