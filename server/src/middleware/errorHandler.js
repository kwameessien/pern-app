function notFoundHandler(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  error.code = "NOT_FOUND";
  next(error);
}

function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || (statusCode === 404 ? "NOT_FOUND" : "INTERNAL_ERROR");

  res.status(statusCode).json({
    status: "error",
    error: {
      code,
      message: err.message || "Something went wrong",
    },
    details: err.details || null,
    timestamp: new Date().toISOString(),
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
