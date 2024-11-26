// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const { errors } = require("celebrate");
// const winston = require("winston");
// const expressWinston = require("express-winston");
// require("dotenv").config();

// const mainRouter = require("./routes/index");
// const errorHandler = require("./middlewares/errorHandler"); // Centralized error handler

// require("dotenv").config(); // Load environment variables from .env

// const app = express();
// const { PORT = 3001 } = process.env;

// // Connect to MongoDB
// mongoose
//   .connect("mongodb://127.0.0.1:27017/wtwr_db")
//   .then(() => {
//     console.log("Connected to Database");
//   })
//   .catch((err) => {
//     console.error("Database connection error:", err);
//   });

// // Middleware
// app.use(express.json()); // Parse JSON requests
// app.use(cors()); // Enable CORS

// // Crash test route
// app.get("/crash-test", () => {
//   setTimeout(() => {
//     throw new Error("Server will crash now");
//   }, 0);
// });

// // Request logging
// app.use(
//   expressWinston.logger({
//     transports: [new winston.transports.File({ filename: "request.log" })],
//     format: winston.format.json(),
//   })
// );

// // Main routes
// app.use("/", mainRouter);

// // Celebrate error handling
// app.use(errors());

// // Error logging
// app.use(
//   expressWinston.errorLogger({
//     transports: [new winston.transports.File({ filename: "error.log" })],
//     format: winston.format.json(),
//   })
// );

// // Centralized error handler
// app.use(errorHandler);

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const winston = require("winston");
const expressWinston = require("express-winston");
require("dotenv").config();

const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler"); // Centralized error handler

const app = express();
const { PORT = 3001 } = process.env;

// Connect to MongoDB
mongoose.set("strictQuery", true); // Suppress the deprecation warning
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS

// Crash test route
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// Request logging
app.use(
  expressWinston.logger({
    transports: [new winston.transports.File({ filename: "request.log" })],
    format: winston.format.json(),
  })
);

// Main routes
app.use("/", mainRouter);

// Celebrate error handling
app.use(errors());

// Error logging
app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.File({ filename: "error.log" })],
    format: winston.format.json(),
  })
);

// Centralized error handler
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
