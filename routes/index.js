const express = require("express");
const auth = require("../middlewares/auth");
const usersRouter = require("./user");
const itemsRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/user");
const { getItems } = require("../controllers/clothingItems");
const { NOT_FOUND_ERROR } = require("../utils/error"); // Import the error constant

const router = express.Router();

// Public routes
router.post("/signin", login);
router.post("/signup", createUser);
router.get("/items", getItems); // Public route for getting items

// Protected routes
router.use(auth); // Apply auth middleware
router.use("/users", usersRouter); // User routes
router.use("/items", itemsRouter); // Protected item routes (create, delete, like, dislike)

// Catch-all for unknown routes
router.use((req, res) =>
  res.status(NOT_FOUND_ERROR).send({ message: "Requested resource not found" })
);

module.exports = router;
