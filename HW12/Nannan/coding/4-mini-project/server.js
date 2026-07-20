import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import projectsRouter from './routes/projects.js';
import tasksRouter from './routes/tasks.js';

const app = express();
app.use(express.json());
app.use('/projects', projectsRouter);
app.use('/tasks', tasksRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = 3011;
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hw12')
  .then(() => app.listen(PORT, () => console.log(`Mini Project API at http://localhost:${PORT}`)))
  .catch(console.error);
