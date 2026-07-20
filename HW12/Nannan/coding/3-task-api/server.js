import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import tasksRouter from './routes/tasks.js';

const app = express();
app.use(express.json());
app.use('/tasks', tasksRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = 3010;
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hw12')
  .then(() => app.listen(PORT, () => console.log(`Task API running at http://localhost:${PORT}`)))
  .catch(console.error);
