import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import reportsRouter from './routes/reports.js';

const app = express();
app.use(express.json());
app.use('/reports', reportsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = 3012;
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hw12')
  .then(() => app.listen(PORT, () => console.log(`Reporting API at http://localhost:${PORT}`)))
  .catch(console.error);
