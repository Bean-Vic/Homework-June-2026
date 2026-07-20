import { Router } from 'express';

const router = Router();

let users = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin',   createdAt: new Date().toISOString() },
  { id: 2, name: 'Bob',   email: 'bob@example.com',   role: 'student', createdAt: new Date().toISOString() },
  { id: 3, name: 'Carol', email: 'carol@example.com', role: 'mentor',  createdAt: new Date().toISOString() },
];
let nextId = 4;

const VALID_ROLES = ['student', 'mentor', 'admin'];

function validateFields(body, requireAll = true) {
  const { name, email, role } = body;
  if (requireAll && (!name || !email || !role)) {
    return 'name, email, and role are required';
  }
  if (role && !VALID_ROLES.includes(role)) {
    return `role must be one of: ${VALID_ROLES.join(', ')}`;
  }
  return null;
}

// GET /users  — filter by role, paginate, search by name or email
router.get('/', (req, res) => {
  const { role, page = 1, limit = 10, search } = req.query;
  let result = [...users];

  if (role) result = result.filter((u) => u.role === role);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }

  const total = result.length;
  const start = (parseInt(page) - 1) * parseInt(limit);
  const data = result.slice(start, start + parseInt(limit));

  res.json({ total, page: parseInt(page), limit: parseInt(limit), data });
});

// GET /users/:id
router.get('/:id', (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// POST /users
router.post('/', (req, res) => {
  const err = validateFields(req.body, true);
  if (err) return res.status(400).json({ error: err });

  const { name, email, role } = req.body;
  const newUser = { id: nextId++, name, email, role, createdAt: new Date().toISOString() };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT /users/:id  — full replace
router.put('/:id', (req, res) => {
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'User not found' });

  const err = validateFields(req.body, true);
  if (err) return res.status(400).json({ error: err });

  const { name, email, role } = req.body;
  users[index] = { ...users[index], name, email, role };
  res.json(users[index]);
});

// PATCH /users/:id  — partial update
router.patch('/:id', (req, res) => {
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'User not found' });

  const err = validateFields(req.body, false);
  if (err) return res.status(400).json({ error: err });

  users[index] = { ...users[index], ...req.body };
  res.json(users[index]);
});

// DELETE /users/:id
router.delete('/:id', (req, res) => {
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  users.splice(index, 1);
  res.status(200).json({ message: 'User deleted' });
});

export default router;
