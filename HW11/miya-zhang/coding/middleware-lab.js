const express = require("express");
const crypto = require("crypto");

const app = express();
const PORT = 3000;

app.use(express.json());

const sessions = {
  "student-access-7f3a92": {
    id: 1,
    name: "Miya Zhang",
    email: "ddz93@uw.edu",
    role: "student",
    program: "MSIM",
  },
  "mentor-access-42c9d1": {
    id: 2,
    name: "Sunayana Patel",
    email: "18513271086@@163.com",
    role: "mentor",
    program: "Web Development",
  },
  "admin-access-9b6e14": {
    id: 3,
    name: "Iris Chen",
    email: "1258677949@qq.com",
    role: "admin",
    program: "Student Services",
  },
};

const reports = [
  {
    id: "RPT-2026-0619",
    title: "Backend Part 1 submission progress",
    owner: "Iris Chen",
    status: "open",
    createdAt: "2026-06-19T15:20:00.000Z",
  },
  {
    id: "RPT-2026-0624",
    title: "Peer mock recording review",
    owner: "Sunayana Patel",
    status: "in_review",
    createdAt: "2026-06-24T18:45:00.000Z",
  },
];

function requestId(req, res, next) {
  req.requestId = crypto.randomUUID();
  res.setHeader("X-Request-Id", req.requestId);
  next();
}

function requestLogger(req, res, next) {
  const startTime = Date.now();

  res.on("finish", () => {
    const responseTime = Date.now() - startTime;

    console.log(
      `[${req.requestId}] ${req.method} ${req.originalUrl} ${res.statusCode} ${responseTime}ms`
    );
  });

  next();
}

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      requestId: req.requestId,
      error: {
        message: "Missing Authorization header.",
      },
    });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      requestId: req.requestId,
      error: {
        message: "Authorization header must use Bearer token.",
      },
    });
  }

  const user = sessions[token];

  if (!user) {
    return res.status(401).json({
      success: false,
      requestId: req.requestId,
      error: {
        message: "Invalid or expired token.",
      },
    });
  }

  req.user = user;
  next();
}

function requireRole(role) {
  return function (req, res, next) {
    if (req.user.role !== role) {
      return res.status(403).json({
        success: false,
        requestId: req.requestId,
        error: {
          message: `This route requires ${role} access.`,
          currentRole: req.user.role,
        },
      });
    }

    next();
  };
}

function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    requestId: req.requestId,
    error: {
      message: "Route was not found.",
      method: req.method,
      path: req.originalUrl,
    },
  });
}

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    requestId: req.requestId,
    error: {
      message: error.message || "Internal server error.",
    },
  });
}

/*
Middleware execution order:
1. express.json()
2. requestId
3. requestLogger
4. route-level middleware, such as auth and requireRole
5. route handler
6. notFound, when no route matches
7. errorHandler, when next(error) is called
*/

app.use(requestId);
app.use(requestLogger);

app.get("/public", (req, res) => {
  res.status(200).json({
    success: true,
    requestId: req.requestId,
    message: "This public route does not require login.",
    course: "JavaScript Backend Fundamentals Part 1",
  });
});

app.get("/profile", auth, (req, res) => {
  res.status(200).json({
    success: true,
    requestId: req.requestId,
    profile: req.user,
  });
});

app.get("/admin/reports", auth, requireRole("admin"), (req, res) => {
  res.status(200).json({
    success: true,
    requestId: req.requestId,
    count: reports.length,
    reports,
  });
});

app.get("/error-demo", async (req, res, next) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const error = new Error("The report service failed while loading data.");
    error.statusCode = 500;

    next(error);
  } catch (error) {
    next(error);
  }
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Express Middleware Lab is running at http://localhost:${PORT}`);
});
