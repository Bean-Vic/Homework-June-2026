const express = require("express");

const requestId = require("./middleware/requestId");
const requestLogger = require("./middleware/requestLogger");
const rateLimiter = require("./middleware/rateLimiter");
const auth = require("./middleware/auth");
const requireRole = require("./middleware/requireRole");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(requestId);
app.use(requestLogger);
app.use(express.json());
app.use(rateLimiter({ windowMs: 60000, max: 60 }));

app.get("/public", (req, res) => {
  res.json({
    message: "This route is open to everyone.",
    requestId: req.requestId,
  });
});

app.get("/profile", auth, (req, res) => {
  res.json({
    message: "Authenticated profile.",
    user: req.user,
    requestId: req.requestId,
  });
});

app.get("/admin/reports", auth, requireRole("admin"), (req, res) => {
  res.json({
    message: "Admin-only reports.",
    reports: [
      { id: "r-1", title: "Weekly signups", value: 128 },
      { id: "r-2", title: "Active mentors", value: 14 },
    ],
    requestId: req.requestId,
  });
});

app.get("/error-demo", async (req, res, next) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 50));
    throw new Error("Something failed inside an async route.");
  } catch (err) {
    next(err);
  }
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`express-middleware-lab listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
