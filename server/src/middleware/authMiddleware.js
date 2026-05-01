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
  } catch (error) {
    if (error.statusCode && error.statusCode >= 500) {
      next(error);
      return;
    }

    const unauthorizedError = new Error("Invalid or expired token");
    unauthorizedError.statusCode = 401;
    unauthorizedError.code = "UNAUTHORIZED";
    next(unauthorizedError);
  }
}

module.exports = {
  requireAuth,
};
