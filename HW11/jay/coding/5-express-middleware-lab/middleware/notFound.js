function notFound(req, res) {
  res.status(404).json({
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      status: 404,
      requestId: req.requestId,
    },
  });
}

module.exports = notFound;
