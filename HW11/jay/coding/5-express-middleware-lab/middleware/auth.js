const tokens = require("../tokens");

function auth(req, res, next) {
  const header = req.headers["authorization"] || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    const err = new Error("Missing or malformed Authorization header");
    err.status = 401;
    return next(err);
  }
  const user = tokens[match[1]];
  if (!user) {
    const err = new Error("Invalid token");
    err.status = 401;
    return next(err);
  }
  req.user = user;
  next();
}

module.exports = auth;
