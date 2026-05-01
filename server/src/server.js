const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
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
});

app.get("/db-health", async (_req, res) => {
  const start = process.hrtime.bigint();

  try {
    await pool.query("SELECT 1");
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
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
