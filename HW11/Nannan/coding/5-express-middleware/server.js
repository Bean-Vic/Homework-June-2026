import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { randomUUID } from 'crypto';

const app = express();

// helmet: sets secure HTTP headers (e.g. X-Frame-Options, X-Content-Type-Options)
// cors: allows/restricts cross-origin requests
app.use(helmet());
app.use(cors());
app.use(express.json());

// Middleware execution order (applied in registration order):
// requestId → requestLogger → route handler → notFound / errorHandler

// 1. requestId — attaches a unique id to every request
function requestId(req, res, next) {
  req.requestId = randomUUID();
  res.setHeader('X-Request-Id', req.requestId);
  next();
}

// 2. requestLogger — logs method, URL, status code, response time
function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    console.log(
      `[${req.requestId}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${Date.now() - start}ms`
    );
  });
  next();
}

// 3. auth — validates Bearer token
const VALID_TOKENS = { 'token-admin': { name: 'Admin', role: 'admin' } };

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ requestId: req.requestId, error: 'Missing or invalid Authorization header' });
  }
  const token = header.slice(7);
  const user = VALID_TOKENS[token];
  if (!user) {
    return res.status(401).json({ requestId: req.requestId, error: 'Invalid token' });
  }
  req.user = user;
  next();
}

// 4. requireRole — rejects users without the required role
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ requestId: req.requestId, error: `Requires role: ${role}` });
    }
    next();
  };
}

// 5. notFound — 404 handler for unknown routes
function notFound(req, res) {
  res.status(404).json({ requestId: req.requestId, error: 'Route not found' });
}

// 6. errorHandler — consistent JSON error format (must have 4 params)
function errorHandler(err, req, res, next) {
  console.error(`[${req.requestId}] Error:`, err.message);
  res.status(err.status || 500).json({
    requestId: req.requestId,
    error: err.message || 'Internal server error',
  });
}

app.use(requestId);
app.use(requestLogger);

// GET /public — no auth required
app.get('/public', (req, res) => {
  res.json({ message: 'This is a public route', requestId: req.requestId });
});

// GET /profile — requires valid token
app.get('/profile', auth, (req, res) => {
  res.json({ message: `Hello, ${req.user.name}`, requestId: req.requestId });
});

// GET /admin/reports — requires token + admin role
app.get('/admin/reports', auth, requireRole('admin'), (req, res) => {
  res.json({ message: 'Admin report data', requestId: req.requestId });
});

// GET /error-demo — demonstrates next(err) and async error handling
app.get('/error-demo', async (req, res, next) => {
  try {
    await Promise.reject(new Error('Something went wrong in async route'));
  } catch (err) {
    next(err);
  }
});

app.use(notFound);
app.use(errorHandler);

const PORT = 3002;
app.listen(PORT, () => console.log(`Middleware Lab running at http://localhost:${PORT}`));
