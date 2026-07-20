import http from 'http';

let users = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin',   createdAt: new Date().toISOString() },
  { id: 2, name: 'Bob',   email: 'bob@example.com',   role: 'student', createdAt: new Date().toISOString() },
];
let nextId = 3;

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { reject(new Error('Invalid JSON body')); }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const start = Date.now();
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { pathname } = url;
  const { method } = req;

  const userIdMatch = pathname.match(/^\/api\/users\/(\d+)$/);

  if (method === 'GET' && pathname === '/health') {
    sendJson(res, 200, { status: 'ok' });

  } else if (method === 'GET' && pathname === '/api/time') {
    sendJson(res, 200, { timestamp: new Date().toISOString() });

  } else if (method === 'GET' && pathname === '/api/users') {
    const roleFilter = url.searchParams.get('role');
    const result = roleFilter ? users.filter((u) => u.role === roleFilter) : users;
    sendJson(res, 200, result);

  } else if (method === 'GET' && userIdMatch) {
    const user = users.find((u) => u.id === parseInt(userIdMatch[1]));
    if (!user) return sendJson(res, 404, { error: 'User not found' });
    sendJson(res, 200, user);

  } else if (method === 'POST' && pathname === '/api/users') {
    let body;
    try { body = await parseBody(req); }
    catch { return sendJson(res, 400, { error: 'Invalid JSON body' }); }
    const { name, email, role } = body;
    if (!name || !email || !role) {
      return sendJson(res, 400, { error: 'name, email, and role are required' });
    }
    const newUser = { id: nextId++, name, email, role, createdAt: new Date().toISOString() };
    users.push(newUser);
    sendJson(res, 201, newUser);

  } else if (/^\/api\/users(\/\d+)?$/.test(pathname) || pathname === '/health' || pathname === '/api/time') {
    sendJson(res, 405, { error: 'Method not allowed' });

  } else {
    sendJson(res, 404, { error: 'Not found' });
  }

  // Extra credit: request logging
  console.log(`${method} ${pathname} ${res.statusCode} - ${Date.now() - start}ms`);
});

const PORT = 3000;
server.listen(PORT, () => console.log(`HTTP server running at http://localhost:${PORT}`));
