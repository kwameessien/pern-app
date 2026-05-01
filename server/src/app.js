const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/healthRoutes");
const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require("./routes/authRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", healthRoutes);
app.use("/todos", todoRoutes);
app.use("/auth", authRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
