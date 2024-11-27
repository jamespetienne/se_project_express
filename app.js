const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { errors } = require("celebrate");
require("dotenv").config();

const { requestLogger, errorLogger } = require("./utils/logger"); // Import loggers
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const limiter = require("./middlewares/rateLimiter");
const NotFoundError = require("./errors/NotFoundError");

const app = express();
const { PORT = 3001 } = process.env;

// Connect to MongoDB
mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// Middleware
app.use(helmet()); // Security headers
app.use(limiter); // Rate limiting
app.use(express.json()); // Parse JSON requests

// CORS Configuration
const allowedOrigins = [
  "https://wtwr-project.twilightparadox.com",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
  })
);

// Crash test route
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// Request logging
app.use(requestLogger); // Use the imported request logger

// Main routes
app.use("/", mainRouter);

// Middleware for unknown routes
app.use((req, res, next) => {
  next(new NotFoundError("The requested resource was not found"));
});

// Error logging
app.use(errorLogger); // Use the imported error logger

// Celebrate error handling
app.use(errors());

// Centralized error handler
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
