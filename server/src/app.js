const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/healthRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", healthRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
