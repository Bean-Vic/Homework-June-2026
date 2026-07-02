function requireRole(role) {
  return function (req, res, next) {
    if (!req.user) {
      const err = new Error("Authentication required");
      err.status = 401;
      return next(err);
    }
    if (req.user.role !== role) {
      const err = new Error(`Requires role: ${role}`);
      err.status = 403;
      return next(err);
    }
    next();
  };
}

module.exports = requireRole;
