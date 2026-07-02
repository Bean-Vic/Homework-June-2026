function requestLogger(req, res, next) {
  const start = process.hrtime.bigint();
  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const ms = Number(end - start) / 1e6;
    console.log(
      `[${new Date().toISOString()}] id=${req.requestId} ${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(1)}ms`
    );
  });
  next();
}

module.exports = requestLogger;
