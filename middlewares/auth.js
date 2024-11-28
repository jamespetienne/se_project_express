const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/UnauthorizedError"); // Import directly without braces

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authorization required");
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // Attach payload to the request object
    next();
  } catch (err) {
    throw new UnauthorizedError("Authorization required");
  }
};

module.exports = auth;
