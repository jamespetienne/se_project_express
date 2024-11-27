const express = require("express");
const auth = require("../middlewares/auth");
const usersRouter = require("./user");
const itemsRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/user");
const { getItems } = require("../controllers/clothingItems");
const { validateSignup, validateLogin } = require("../middlewares/validation");
const NotFoundError = require("../errors/NotFoundError"); // Import the custom error class

const router = express.Router();

// Public routes
router.post("/signin", validateLogin, login);
router.post("/signup", validateSignup, createUser);
router.get("/items", getItems); // Public route for getting items

// Protected routes
router.use(auth); // Apply auth middleware
router.use("/users", usersRouter); // User routes
router.use("/items", itemsRouter); // Protected item routes (create, delete, like, dislike)

// Catch-all for unknown routes
router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found")); // Throw an error instead of sending a response
});

module.exports = router;
