const express = require("express");
const usersRouter = require("./users.router");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ error: { message: `route not found: ${req.method} ${req.originalUrl}` } });
});

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: { message: "invalid JSON body" } });
  }
  console.error(err);
  res.status(500).json({ error: { message: "internal server error" } });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`express-user-api listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
