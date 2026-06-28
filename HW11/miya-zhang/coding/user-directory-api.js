const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

let users = [
  {
    id: 1,
    name: "Miya Zhang",
    email: "ddz93@uw.edu",
    role: "student",
    createdAt: "2026-06-20T10:15:00.000Z",
  },
  {
    id: 2,
    name: "Iris Chen",
    email: "18513271086@163.com",
    role: "admin",
    createdAt: "2026-06-21T09:30:00.000Z",
  },
  {
    id: 3,
    name: "Sunayana Patel",
    email: "dandanlaicai117@gmail.com",
    role: "mentor",
    createdAt: "2026-06-22T14:45:00.000Z",
  },
  {
    id: 4,
    name: "Shree Kumar",
    email: "1258677949@qq.com",
    role: "mentor",
    createdAt: "2026-06-23T18:20:00.000Z",
  },
  {
    id: 5,
    name: "Rachel Lee",
    email: "della@gmail.com",
    role: "student",
    createdAt: "2026-06-24T12:05:00.000Z",
  },
];

let nextId = 6;

const allowedRoles = ["student", "mentor", "admin"];

function sendError(res, statusCode, message) {
  return res.status(statusCode).json({
    success: false,
    error: message,
  });
}

function validateUser(data, requireAllFields) {
  const requiredFields = ["name", "email", "role"];
  const missingFields = [];

  if (requireAllFields) {
    for (const field of requiredFields) {
      if (!data[field] || String(data[field]).trim() === "") {
        missingFields.push(field);
      }
    }
  }

  if (missingFields.length > 0) {
    return `Missing required field(s): ${missingFields.join(", ")}`;
  }

  if (data.email !== undefined && !String(data.email).includes("@")) {
    return "Email must be a valid email address.";
  }

  if (data.role !== undefined && !allowedRoles.includes(data.role)) {
    return "Role must be student, mentor, or admin.";
  }

  return null;
}

function findUserById(id) {
  return users.find((user) => user.id === id);
}

app.get("/users", (req, res) => {
  const role = req.query.role;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  if (page < 1 || limit < 1) {
    return sendError(res, 400, "Page and limit must be positive numbers.");
  }

  let result = users;

  if (role) {
    if (!allowedRoles.includes(role)) {
      return sendError(res, 400, "Role must be student, mentor, or admin.");
    }

    result = users.filter((user) => user.role === role);
  }

  const startIndex = (page - 1) * limit;
  const paginatedUsers = result.slice(startIndex, startIndex + limit);

  res.status(200).json({
    success: true,
    page,
    limit,
    totalUsers: result.length,
    users: paginatedUsers,
  });
});

app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return sendError(res, 400, "User id must be a number.");
  }

  const user = findUserById(id);

  if (!user) {
    return sendError(res, 404, "User was not found.");
  }

  res.status(200).json({
    success: true,
    user,
  });
});

app.post("/users", (req, res) => {
  const validationError = validateUser(req.body, true);

  if (validationError) {
    return sendError(res, 400, validationError);
  }

  const newUser = {
    id: nextId,
    name: req.body.name.trim(),
    email: req.body.email.trim(),
    role: req.body.role.trim(),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  nextId += 1;

  res.status(201).json({
    success: true,
    message: "User created successfully.",
    user: newUser,
  });
});

app.put("/users/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return sendError(res, 400, "User id must be a number.");
  }

  const user = findUserById(id);

  if (!user) {
    return sendError(res, 404, "User was not found.");
  }

  const validationError = validateUser(req.body, true);

  if (validationError) {
    return sendError(res, 400, validationError);
  }

  user.name = req.body.name.trim();
  user.email = req.body.email.trim();
  user.role = req.body.role.trim();

  res.status(200).json({
    success: true,
    message: "User updated successfully.",
    user,
  });
});

app.patch("/users/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return sendError(res, 400, "User id must be a number.");
  }

  const user = findUserById(id);

  if (!user) {
    return sendError(res, 404, "User was not found.");
  }

  const validationError = validateUser(req.body, false);

  if (validationError) {
    return sendError(res, 400, validationError);
  }

  if (req.body.name !== undefined) {
    user.name = req.body.name.trim();
  }

  if (req.body.email !== undefined) {
    user.email = req.body.email.trim();
  }

  if (req.body.role !== undefined) {
    user.role = req.body.role.trim();
  }

  res.status(200).json({
    success: true,
    message: "User partially updated successfully.",
    user,
  });
});

app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return sendError(res, 400, "User id must be a number.");
  }

  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return sendError(res, 404, "User was not found.");
  }

  const deletedUser = users.splice(userIndex, 1)[0];

  res.status(200).json({
    success: true,
    message: "User deleted successfully.",
    user: deletedUser,
  });
});

app.use((req, res) => {
  return sendError(res, 404, "Route was not found.");
});

app.listen(PORT, () => {
  console.log(`User Directory API is running at http://localhost:${PORT}`);
});
