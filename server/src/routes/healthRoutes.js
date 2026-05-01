const express = require("express");
const { getHealth, getDbHealth } = require("../controllers/healthController");

const router = express.Router();

router.get("/health", getHealth);
router.get("/db-health", getDbHealth);

module.exports = router;
