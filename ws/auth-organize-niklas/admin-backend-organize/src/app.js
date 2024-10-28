require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const authenticateAdmin = require("./middleware/authenticateAdmin");
const { AUTH, AUTH_TYPES } = require("./config");

// Initialize admin routes
const adminRoutes = {
  [AUTH_TYPES.BASIC]: require("./routes/adminRoutes.js"),
};

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"], // Corrected typo
    credentials: true,
  })
);

// Rate limiter configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

// Middleware usage
app.use(express.json()); // Added parentheses
app.use(cookieParser());
app.use(limiter);
app.use(helmet());

// Route setup
app.use("/api/auth", adminRoutes[AUTH_TYPES.BASIC]); // Basic auth routes

// This should specify the route, not the entire adminRoutes object
app.use("/api/admin", authenticateAdmin, adminRoutes[AUTH_TYPES.BASIC]); // Use specific auth type

module.exports = app;
