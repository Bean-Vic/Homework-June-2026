import express from 'express';
import { readFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// asyncHandler wraps an async route so thrown errors reach global error middleware
// without needing try/catch in every route
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

// Global unhandledRejection handler — catches promises rejected outside Express
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

// GET /slow-success — waits 300ms and returns success
app.get('/slow-success', asyncHandler(async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  res.json({ message: 'Success after 300ms' });
}));

// GET /slow-fail — waits 300ms and throws an error
app.get('/slow-fail', asyncHandler(async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  throw new Error('Intentional async error after 300ms');
}));

// GET /read-file — reads sample.txt and returns its content
app.get('/read-file', asyncHandler(async (req, res) => {
  const content = await readFile(resolve(__dirname, 'sample.txt'), 'utf8');
  res.json({ content });
}));

// Extra credit: execution order demo
// Order: synchronous → process.nextTick → Promise.then → setTimeout → setImmediate
app.get('/execution-order', asyncHandler(async (req, res) => {
  const log = [];

  log.push('1. sync start');

  process.nextTick(() => log.push('3. process.nextTick'));

  Promise.resolve().then(() => log.push('4. Promise.then'));

  setTimeout(() => log.push('5. setTimeout'), 0);

  setImmediate(() => log.push('6. setImmediate'));

  log.push('2. sync end');

  // Yield so the microtasks and macrotasks above can run
  await new Promise((resolve) => setTimeout(resolve, 10));

  res.json({ executionOrder: log });
}));

// Global error handler (4 params required by Express)
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = 3003;
app.listen(PORT, () => console.log(`Async Error Demo running at http://localhost:${PORT}`));
