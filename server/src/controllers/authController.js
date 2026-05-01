const {
  findUserByEmail,
  createUser,
  hashPassword,
  comparePassword,
  signAuthToken,
} = require("../services/authService");

function badRequest(message, details) {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = "BAD_REQUEST";
  error.details = details;
  return error;
}

function unauthorized(message) {
  const error = new Error(message);
  error.statusCode = 401;
  error.code = "UNAUTHORIZED";
  return error;
}

function conflict(message, details) {
  const error = new Error(message);
  error.statusCode = 409;
  error.code = "CONFLICT";
  error.details = details;
  return error;
}

function validateCredentials(email, password) {
  if (typeof email !== "string" || email.trim() === "") {
    throw badRequest("Field 'email' is required", { field: "email" });
  }
  if (typeof password !== "string" || password.length < 6) {
    throw badRequest("Password must be at least 6 characters", { field: "password" });
  }
}

async function signupHandler(req, res, next) {
  try {
    const { email, password } = req.body || {};
    validateCredentials(email, password);

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      throw conflict("Email is already registered", { field: "email" });
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser(normalizedEmail, passwordHash);
    const token = signAuthToken(user);

    res.status(201).json({
      status: "ok",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function loginHandler(req, res, next) {
  try {
    const { email, password } = req.body || {};
    validateCredentials(email, password);

    const normalizedEmail = email.trim().toLowerCase();
    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
      throw unauthorized("Invalid email or password");
    }

    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw unauthorized("Invalid email or password");
    }

    const token = signAuthToken(user);

    res.status(200).json({
      status: "ok",
      data: {
        user: { id: user.id, email: user.email },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  signupHandler,
  loginHandler,
};
