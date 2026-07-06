const express = require("express");
const fs = require("fs/promises");

const app = express();
const PORT = 3000;

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

process.on("unhandledRejection", (reason) => {
  console.log("Unhandled Rejection:", reason);
});

app.get(
  "/slow-success",
  asyncHandler(async (req, res) => {
    await delay(300);

    res.json({
      message: "Success after 300ms",
    });
  })
);

app.get(
  "/slow-fail",
  asyncHandler(async (req, res) => {
    await delay(300);

    throw new Error("Something failed after 300ms");
  })
);

app.get(
  "/read-file",
  asyncHandler(async (req, res) => {
    const content = await fs.readFile("sample.txt", "utf8");

    res.json({
      content: content,
    });
  })
);

app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});