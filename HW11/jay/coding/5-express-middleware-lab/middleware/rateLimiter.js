function rateLimiter({ windowMs = 60000, max = 30 } = {}) {
  const hits = new Map();
  return function (req, res, next) {
    const key = req.ip;
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || now > entry.resetAt) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    entry.count += 1;
    if (entry.count > max) {
      res.setHeader("Retry-After", Math.ceil((entry.resetAt - now) / 1000));
      const err = new Error("Too many requests");
      err.status = 429;
      return next(err);
    }
    next();
  };
}

module.exports = rateLimiter;
