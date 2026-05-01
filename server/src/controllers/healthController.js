const { checkDatabase } = require("../services/healthService");

async function getHealth(_req, res, next) {
  try {
    await checkDatabase();
    res.status(200).json({
      status: "ok",
      service: "server",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    error.statusCode = 500;
    error.code = "DB_UNAVAILABLE";
    error.details = { service: "server", database: "disconnected" };
    next(error);
  }
}

async function getDbHealth(_req, res, next) {
  const start = process.hrtime.bigint();

  try {
    await checkDatabase();
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;

    res.status(200).json({
      status: "ok",
      service: "server",
      database: "connected",
      queryTimeMs: Number(durationMs.toFixed(2)),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    error.statusCode = 500;
    error.code = "DB_UNAVAILABLE";
    error.details = {
      service: "server",
      database: "disconnected",
      queryTimeMs: Number(durationMs.toFixed(2)),
    };
    next(error);
  }
}

module.exports = {
  getHealth,
  getDbHealth,
};
