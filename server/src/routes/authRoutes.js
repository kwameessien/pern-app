const express = require("express");
const { signupHandler, loginHandler } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signupHandler);
router.post("/login", loginHandler);

module.exports = router;
