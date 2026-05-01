const { checkDatabase } = require("../services/healthService");

async function getHealth(_req, res) {
  try {
    await checkDatabase();
    res.status(200).json({
      status: "ok",
      service: "server",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      service: "server",
      database: "disconnected",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

async function getDbHealth(_req, res) {
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

    res.status(500).json({
      status: "error",
      service: "server",
      database: "disconnected",
      queryTimeMs: Number(durationMs.toFixed(2)),
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

module.exports = {
  getHealth,
  getDbHealth,
};
