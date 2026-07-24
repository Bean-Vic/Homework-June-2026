const http = require('http');

// In-memory user database
const users = [
  { id: 1, name: 'Steve', role: 'admin' },
  { id: 2, name: 'Bobby', role: 'user' }
];
let nextId = 3;

// Helper function for sending JSON responses
const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

const server = http.createServer(async (req, res) => {
  const method = req.method;
  const url = req.url;

  // 1. GET /health
  if (url === '/health' && method === 'GET') {
    return sendJSON(res, 200, { status: 'ok' });
  }

  // 2. GET /api/time
  if (url === '/api/time' && method === 'GET') {
    return sendJSON(res, 200, { time: new Date().toISOString() });
  }

  // 3. GET /api/users
  if (url === '/api/users' && method === 'GET') {
    return sendJSON(res, 200, users);
  }

  // 4. GET /api/users/:id
  if (url.startsWith('/api/users/') && method === 'GET') {
    const idString = url.split('/')[3];
    const id = parseInt(idString, 10);
    
    const user = users.find(u => u.id === id);
    if (user) {
      return sendJSON(res, 200, user);
    } else {
      return sendJSON(res, 404, { error: 'User not found' });
    }
  }

  // 5. POST /api/users
  if (url === '/api/users' && method === 'POST') {
    let bodyChunks = [];

    try {
      for await (const chunk of req) {
				bodyChunks.push(chunk);
			}
			const parsedBody = JSON.parse(Buffer.concat(bodyChunks).toString());

			// Handle invalid JSON body
			if (!parsedBody.name) {
				return sendJSON(res, 400, { error: 'Bad Request - name is required' });
			}

			const newUser = {
				id: nextId++,
				...parsedBody
			};
			users.push(newUser);
			
			// 201 Created
			return sendJSON(res, 201, newUser);

    } catch (error) {
        // Handle invalid JSON body
        return sendJSON(res, 400, { error: 'Bad Request - Invalid JSON format' });
    }
  }

  // 405 Method Not Allowed
  if (url === '/api/users' || url.startsWith('/api/users/')) {
     return sendJSON(res, 405, { error: 'Method Not Allowed' });
  }

  // 404 Not Found
  return sendJSON(res, 404, { error: 'Not Found' });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Native HTTP server running on port ${PORT}`);
});