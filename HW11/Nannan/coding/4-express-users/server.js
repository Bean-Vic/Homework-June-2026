import express from 'express';
import usersRouter from './routes/users.js';

const app = express();
app.use(express.json());

app.use('/users', usersRouter);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Express Users API running at http://localhost:${PORT}`));
