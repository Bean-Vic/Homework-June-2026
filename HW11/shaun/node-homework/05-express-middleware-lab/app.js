const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

function requestId(req, res, next) {
  req.requestId = Date.now().toString();
  next();
}

function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const time = Date.now() - start;
    console.log(
      `[${req.requestId}] ${req.method} ${req.originalUrl} ${res.statusCode} ${time}ms`
    );
  });

  next();
}

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      requestId: req.requestId,
      error: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  if (token === "admin-token") {
    req.user = {
      name: "Admin User",
      role: "admin",
    };
  } else if (token === "user-token") {
    req.user = {
      name: "Regular User",
      role: "user",
    };
  } else {
    return res.status(401).json({
      requestId: req.requestId,
      error: "Unauthorized",
    });
  }

  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        requestId: req.requestId,
        error: "Forbidden",
      });
    }

    next();
  };
}

function notFound(req, res) {
  res.status(404).json({
    requestId: req.requestId,
    error: "Not Found",
  });
}

function errorHandler(err, req, res, next) {
  res.status(500).json({
    requestId: req.requestId,
    error: err.message,
  });
}

app.use(requestId);
app.use(requestLogger);

app.get("/public", (req, res) => {
  res.json({
    message: "Public route",
  });
});

app.get("/profile", auth, (req, res) => {
  res.json({
    message: "Profile route",
    user: req.user,
  });
});

app.get("/admin/reports", auth, requireRole("admin"), (req, res) => {
  res.json({
    message: "Admin reports",
    data: ["report1", "report2"],
  });
});

app.get("/error-demo", (req, res, next) => {
  next(new Error("Something went wrong"));
});

app.get("/async-error-demo", async (req, res, next) => {
  try {
    await Promise.reject(new Error("Async error happened"));
  } catch (err) {
    next(err);
  }
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});