// Tasks 3-5: Express + MongoDB + Mongoose API
// Run: node api/server.js
require('dotenv').config();
const express = require('express');
const { connectDB } = require('./db');

// Register all models up front so populate() can resolve refs like 'User'
require('./models/User');
require('./models/Project');
require('./models/Task');

const app = express();
app.use(express.json());

app.use('/tasks', require('./routes/tasks'));
app.use('/projects', require('./routes/projects'));
app.use('/reports', require('./routes/reports'));

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// Central error handler — maps Mongoose errors to proper JSON responses
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const details = Object.fromEntries(
      Object.entries(err.errors).map(([field, e]) => [field, e.message])
    );
    return res.status(400).json({ error: 'Validation failed', details });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Invalid value for ${err.path}: ${err.value}` });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Duplicate key', details: err.keyValue });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to start:', err);
    process.exit(1);
  });
