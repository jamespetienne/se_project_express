const express = require("express");
const auth = require("../middlewares/auth");
const usersRouter = require("./user");
const itemsRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/user");
const { getItems } = require("../controllers/clothingItems"); // Correct import for getItems

const router = express.Router();

// Constants for status codes
const NOT_FOUND_ERROR = 404;

// Public routes
router.post("/signin", login);
router.post("/signup", createUser);
router.get("/items", getItems); // Correctly link to the getItems controller

// Protected routes
router.use(auth); // Apply auth middleware
router.use("/users", usersRouter); // User routes
router.use("/items", itemsRouter); // Other items routes (create, delete, like, dislike)

// Catch-all middleware for unknown routes (simplified arrow function)
router.use((req, res) =>
  res.status(NOT_FOUND_ERROR).send({ message: "Requested resource not found" })
);

module.exports = router;
