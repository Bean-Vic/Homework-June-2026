const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());

function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function sendError(res, statusCode, message) {
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
    },
  });
}

app.get(
  "/slow-success",
  asyncHandler(async (req, res) => {
    await wait(300);

    res.status(200).json({
      success: true,
      message: "Backend health check finished successfully.",
      delayMs: 300,
      service: "student-directory-api",
      checkedAt: new Date().toISOString(),
    });
  })
);

app.get(
  "/slow-fail",
  asyncHandler(async (req, res) => {
    await wait(300);

    const error = new Error(
      "The student directory service could not finish the async request."
    );
    error.statusCode = 500;

    throw error;
  })
);

app.get(
  "/read-file",
  asyncHandler(async (req, res) => {
    const filePath = path.join(__dirname, "backend-refactor-notes.md");
    const content = await fs.readFile(filePath, "utf8");

    res.status(200).json({
      success: true,
      fileName: "backend-refactor-notes.md",
      absolutePath: filePath,
      characterCount: content.length,
      content,
    });
  })
);

app.get("/event-loop-order", (req, res) => {
  const output = [];

  output.push("1. route handler started");

  process.nextTick(() => {
    output.push("2. process.nextTick callback");
  });

  Promise.resolve().then(() => {
    output.push("3. promise.then callback");
  });

  setTimeout(() => {
    output.push("4. setTimeout callback");
    output.push("5. response sent after async callbacks");

    res.status(200).json({
      success: true,
      message: "Observed async execution order in Node.js.",
      output,
    });
  }, 0);
});

app.use((req, res) => {
  return sendError(res, 404, "Route was not found.");
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: {
      message: error.message || "Internal server error.",
    },
  });
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection detected:");
  console.error(reason);
});

app.listen(PORT, () => {
  console.log(`Async Error Handling app is running at http://localhost:${PORT}`);
});
