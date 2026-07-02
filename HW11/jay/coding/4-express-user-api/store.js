const ROLES = ["student", "mentor", "admin"];

let nextId = 1;
const users = [];

function create({ name, email, role }) {
  const user = {
    id: nextId++,
    name,
    email,
    role,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
}

function seed() {
  const samples = [
    { name: "Alice Chen", email: "alice@example.com", role: "student" },
    { name: "Bob Smith", email: "bob@example.com", role: "mentor" },
    { name: "Carol Diaz", email: "carol@example.com", role: "admin" },
    { name: "David Lee", email: "david@example.com", role: "student" },
    { name: "Eve Wang", email: "eve@example.com", role: "mentor" },
  ];
  for (const s of samples) create(s);
}

function list() {
  return users;
}

function findById(id) {
  return users.find((u) => u.id === id);
}

function replace(user, { name, email, role }) {
  user.name = name;
  user.email = email;
  user.role = role;
  return user;
}

function update(user, patch) {
  if (patch.name !== undefined) user.name = patch.name;
  if (patch.email !== undefined) user.email = patch.email;
  if (patch.role !== undefined) user.role = patch.role;
  return user;
}

function remove(id) {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  return users.splice(index, 1)[0];
}

seed();

module.exports = { ROLES, list, findById, create, replace, update, remove };
