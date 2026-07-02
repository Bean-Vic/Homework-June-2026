function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status >= 500) {
    console.error(`id=${req.requestId} ${err.stack || err.message}`);
  }
  res.status(status).json({
    error: {
      message: err.message || "Internal Server Error",
      status,
      requestId: req.requestId,
    },
  });
}

module.exports = errorHandler;
