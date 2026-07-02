const express = require("express");
const store = require("./store");
const {
  validateCreate,
  validateReplace,
  validatePatch,
} = require("./validation");

const router = express.Router();

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function getUserOr404(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: { message: "id must be a positive integer" } });
    return null;
  }
  const user = store.findById(id);
  if (!user) {
    res.status(404).json({ error: { message: `user ${id} not found` } });
    return null;
  }
  return user;
}

router.get("/", (req, res) => {
  const { role, q } = req.query;
  let results = store.list();

  if (role !== undefined) {
    results = results.filter((u) => u.role === role);
  }

  if (q !== undefined && q.trim() !== "") {
    const keyword = q.trim().toLowerCase();
    results = results.filter(
      (u) =>
        u.name.toLowerCase().includes(keyword) ||
        u.email.toLowerCase().includes(keyword)
    );
  }

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));
  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = results.slice(start, start + limit);

  res.json({ data, pagination: { page, limit, total, totalPages } });
});

router.get("/:id", (req, res) => {
  const user = getUserOr404(req, res);
  if (!user) return;
  res.json({ data: user });
});

router.post("/", (req, res) => {
  const errors = validateCreate(req.body || {});
  if (errors.length > 0) {
    return res.status(400).json({ error: { message: "validation failed", details: errors } });
  }
  const { name, email, role } = req.body;
  const user = store.create({ name, email, role });
  res.status(201).json({ data: user });
});

router.put("/:id", (req, res) => {
  const user = getUserOr404(req, res);
  if (!user) return;
  const errors = validateReplace(req.body || {});
  if (errors.length > 0) {
    return res.status(400).json({ error: { message: "validation failed", details: errors } });
  }
  const { name, email, role } = req.body;
  const updated = store.replace(user, { name, email, role });
  res.json({ data: updated });
});

router.patch("/:id", (req, res) => {
  const user = getUserOr404(req, res);
  if (!user) return;
  const errors = validatePatch(req.body || {});
  if (errors.length > 0) {
    return res.status(400).json({ error: { message: "validation failed", details: errors } });
  }
  const updated = store.update(user, req.body);
  res.json({ data: updated });
});

router.delete("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: { message: "id must be a positive integer" } });
  }
  const deleted = store.remove(id);
  if (!deleted) {
    return res.status(404).json({ error: { message: `user ${id} not found` } });
  }
  res.json({ data: deleted });
});

module.exports = router;
