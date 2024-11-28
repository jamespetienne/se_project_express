const expressWinston = require("express-winston");
const winston = require("winston");

// Request logger
const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: "request.log" })],
  format: winston.format.json(),
});

// Error logger
const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: "error.log" })],
  format: winston.format.json(),
});

// General-purpose logger
const generalLogger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    // Log to the console
    new winston.transports.Console(),
    // Log to a file
    new winston.transports.File({ filename: "server.log" }),
  ],
});

module.exports = { requestLogger, errorLogger, generalLogger };
