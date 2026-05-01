const { verifyAuthToken } = require("../services/authService");

function requireAuth(req, _res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      const error = new Error("Missing or invalid Authorization header");
      error.statusCode = 401;
      error.code = "UNAUTHORIZED";
      throw error;
    }

    const token = authHeader.slice("Bearer ".length).trim();
    if (!token) {
      const error = new Error("Missing bearer token");
      error.statusCode = 401;
      error.code = "UNAUTHORIZED";
      throw error;
    }

    const payload = verifyAuthToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
    };

    next();
  } catch (_error) {
    const error = new Error("Invalid or expired token");
    error.statusCode = 401;
    error.code = "UNAUTHORIZED";
    next(error);
  }
}

module.exports = {
  requireAuth,
};
