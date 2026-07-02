const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const asyncHandler = require("./asyncHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.get(
  "/slow-success",
  asyncHandler(async (req, res) => {
    await delay(300);
    res.json({ status: "ok", message: "slow success after 300ms" });
  })
);

app.get(
  "/slow-fail",
  asyncHandler(async (req, res) => {
    await delay(300);
    throw new Error("slow failure after 300ms");
  })
);

app.get(
  "/read-file",
  asyncHandler(async (req, res) => {
    const filePath = path.join(__dirname, "data.txt");
    const content = await fs.readFile(filePath, "utf8");
    res.json({ status: "ok", file: "data.txt", content });
  })
);

app.get(
  "/order-demo",
  asyncHandler(async (req, res) => {
    const order = [];

    order.push("sync-start");

    setTimeout(() => order.push("setTimeout"), 0);

    Promise.resolve().then(() => order.push("promise.then"));

    process.nextTick(() => order.push("process.nextTick"));

    order.push("sync-end");

    await delay(50);

    res.json({ order });
  })
);

app.use((req, res) => {
  res.status(404).json({ error: { message: "Not Found", path: req.originalUrl } });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || "Internal Server Error",
      status,
    },
  });
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Async error handling app listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
