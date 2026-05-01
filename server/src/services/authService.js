const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const SALT_ROUNDS = 10;

async function findUserByEmail(email) {
  const query = `
    SELECT id, email, password_hash
    FROM users
    WHERE email = $1
  `;
  const { rows } = await pool.query(query, [email]);
  return rows[0] || null;
}

async function createUser(email, passwordHash) {
  const query = `
    INSERT INTO users (email, password_hash)
    VALUES ($1, $2)
    RETURNING id, email
  `;
  const { rows } = await pool.query(query, [email, passwordHash]);
  return rows[0];
}

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

function signAuthToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const error = new Error("JWT_SECRET is not configured");
    error.statusCode = 500;
    error.code = "SERVER_CONFIG_ERROR";
    throw error;
  }

  return jwt.sign(
    { sub: user.id, email: user.email },
    secret,
    { expiresIn: "7d" },
  );
}

function verifyAuthToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const error = new Error("JWT_SECRET is not configured");
    error.statusCode = 500;
    error.code = "SERVER_CONFIG_ERROR";
    throw error;
  }

  return jwt.verify(token, secret);
}

module.exports = {
  findUserByEmail,
  createUser,
  hashPassword,
  comparePassword,
  signAuthToken,
  verifyAuthToken,
};
