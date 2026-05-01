const dotenv = require("dotenv");
const pool = require("./db");

dotenv.config();

async function runDbTest() {
  const start = process.hrtime.bigint();

  try {
    await pool.query("SELECT 1");
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    console.log(`DB OK (${durationMs.toFixed(2)} ms)`);
    process.exitCode = 0;
  } catch (error) {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    console.error(`DB FAIL (${durationMs.toFixed(2)} ms): ${error.message}`);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

runDbTest();
