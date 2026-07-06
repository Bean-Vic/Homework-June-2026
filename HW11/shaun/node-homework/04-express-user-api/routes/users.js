const express = require("express");

const router = express.Router();

let users = [
  {
    id: 1,
    name: "Alice",
    email: "alice@test.com",
    role: "student",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@test.com",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
];

function isValidRole(role) {
  return ["student", "mentor", "admin"].includes(role);
}

function validateUser(data) {
  if (!data.name || !data.email || !data.role) {
    return false;
  }

  if (!isValidRole(data.role)) {
    return false;
  }

  return true;
}

router.get("/", (req, res) => {
  const { role, page = 1, limit = 10 } = req.query;

  let result = users;

  if (role) {
    result = result.filter((user) => user.role === role);
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const startIndex = (pageNumber - 1) * limitNumber;
  const endIndex = startIndex + limitNumber;

  const paginatedUsers = result.slice(startIndex, endIndex);

  res.json({
    data: paginatedUsers,
    page: pageNumber,
    limit: limitNumber,
    total: result.length,
  });
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  res.json(user);
});

router.post("/", (req, res) => {
  if (!validateUser(req.body)) {
    return res.status(400).json({
      error: "Name, email, and valid role are required",
    });
  }

  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  res.status(201).json(newUser);
});

router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  if (!validateUser(req.body)) {
    return res.status(400).json({
      error: "Name, email, and valid role are required",
    });
  }

  users[userIndex] = {
    ...users[userIndex],
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  res.json(users[userIndex]);
});

router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  if (req.body.role && !isValidRole(req.body.role)) {
    return res.status(400).json({
      error: "Role must be student, mentor, or admin",
    });
  }

  if (req.body.name !== undefined) {
    user.name = req.body.name;
  }

  if (req.body.email !== undefined) {
    user.email = req.body.email;
  }

  if (req.body.role !== undefined) {
    user.role = req.body.role;
  }

  res.json(user);
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  const deletedUser = users.splice(userIndex, 1)[0];

  res.json(deletedUser);
});

module.exports = router;