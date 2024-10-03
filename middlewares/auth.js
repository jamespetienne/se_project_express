const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

// Constants for status codes
const UNAUTHORIZED_ERROR = 401;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(UNAUTHORIZED_ERROR)
      .send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(UNAUTHORIZED_ERROR)
      .send({ message: "Authorization required" });
  }

  req.user = payload;

  return next(); // Ensure next() is explicitly returned
};

module.exports = auth;
