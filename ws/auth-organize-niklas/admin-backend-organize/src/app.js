require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const adminRoutes = require("./authRoutes/routes");
const app = express();

const limiter = rateLimit({
  windows: 15 * 60 * 1000,
  max: 100,
});

app.use(exprss.json);
app.use(cookieParser());
app.use(limiter);
app.use(helmet());

const authRoutes = require("./authRoutes/auth");

module.exports = app;
