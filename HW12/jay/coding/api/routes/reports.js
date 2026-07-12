// Task 5: Reporting API with aggregation pipeline
const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

// Extra credit: tiny in-memory cache with TTL
const cache = new Map();
const CACHE_TTL_MS = 30 * 1000;

function cached(handler) {
  return async (req, res, next) => {
    const key = req.originalUrl;
    const hit = cache.get(key);
    if (hit && Date.now() - hit.time < CACHE_TTL_MS) {
      return res.json({ ...hit.body, cached: true });
    }
    // capture res.json to store the response body
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      cache.set(key, { time: Date.now(), body });
      return originalJson(body);
    };
    handler(req, res, next);
  };
}

// Shared $match stage: exclude soft-deleted, optional createdAt date range
function baseMatch(req) {
  const match = { deletedAt: null };
  const { startDate, endDate } = req.query;
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = new Date(startDate);
    if (endDate) match.createdAt.$lte = new Date(endDate);
  }
  return match;
}

// GET /reports/tasks/summary?startDate=&endDate=&groupBy=status|priority|project|assignee
router.get('/tasks/summary', cached(async (req, res, next) => {
  try {
    // Extra credit: dynamic groupBy
    const allowed = ['status', 'priority', 'project', 'assignee'];
    const groupBy = allowed.includes(req.query.groupBy) ? req.query.groupBy : 'status';

    const [result] = await Task.aggregate([
      { $match: baseMatch(req) },
      {
        $facet: {
          total: [{ $count: 'count' }],
          byGroup: [
            { $group: { _id: `$${groupBy}`, count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { _id: 0, [groupBy]: '$_id', count: 1 } },
          ],
        },
      },
      {
        $project: {
          total: { $ifNull: [{ $arrayElemAt: ['$total.count', 0] }, 0] },
          [`by_${groupBy}`]: '$byGroup',
        },
      },
    ]);

    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}));

// GET /reports/tasks/by-project
router.get('/tasks/by-project', cached(async (req, res, next) => {
  try {
    const rows = await Task.aggregate([
      { $match: baseMatch(req) },
      { $group: { _id: '$project', count: { $sum: 1 }, done: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } } } },
      { $lookup: { from: 'projects', localField: '_id', foreignField: '_id', as: 'project' } },
      { $unwind: { path: '$project', preserveNullAndEmptyArrays: true } },
      { $project: { _id: 0, project: { $ifNull: ['$project.name', '(no project)'] }, count: 1, done: 1 } },
      { $sort: { count: -1 } },
    ]);
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
}));

// GET /reports/tasks/by-assignee
router.get('/tasks/by-assignee', cached(async (req, res, next) => {
  try {
    const rows = await Task.aggregate([
      { $match: baseMatch(req) },
      { $group: { _id: '$assignee', count: { $sum: 1 } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'assignee' } },
      { $unwind: { path: '$assignee', preserveNullAndEmptyArrays: true } },
      { $project: { _id: 0, assignee: { $ifNull: ['$assignee.name', '(unassigned)'] }, email: '$assignee.email', count: 1 } },
      { $sort: { count: -1 } },
    ]);
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
}));

// GET /reports/tasks/overdue — dueDate in the past and not done
router.get('/tasks/overdue', cached(async (req, res, next) => {
  try {
    const rows = await Task.aggregate([
      { $match: { ...baseMatch(req), dueDate: { $lt: new Date() }, status: { $ne: 'done' } } },
      { $sort: { dueDate: 1 } },
      { $limit: 50 },
      { $lookup: { from: 'users', localField: 'assignee', foreignField: '_id', as: 'assignee' } },
      { $unwind: { path: '$assignee', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          title: 1,
          status: 1,
          priority: 1,
          dueDate: 1,
          assignee: { $ifNull: ['$assignee.name', '(unassigned)'] },
          daysOverdue: {
            $floor: { $divide: [{ $subtract: [new Date(), '$dueDate'] }, 1000 * 60 * 60 * 24] },
          },
        },
      },
    ]);
    res.json({ count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
}));

module.exports = router;
