const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE || "pern_app",
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "",
});

module.exports = pool;
