// const express = require("express");
// const { login, createUser } = require("../controllers/user");
// const auth = require("../middlewares/auth"); // Import the authorization middleware
// const itemsRouter = require("./clothingItems"); // Import items routes
// const userRouter = require("./user"); // Import user routes

// const router = express.Router();

// // Public routes (no authorization needed)
// router.post("/signin", login);
// router.post("/signup", createUser);
// router.get("/items", itemsRouter); // Route for fetching items

// // Protected routes (authorization required)
// router.use(auth); // All routes after this line require the auth middleware
// router.use("/users", userRouter); // Protect user-related routes
// router.use("/items", itemsRouter); // Protect item routes like creation, deletion

// module.exports = router;

const express = require('express');
const auth = require('../middlewares/auth');
const usersRouter = require('./user');
const itemsRouter = require('./clothingItems');
const { login, createUser } = require('../controllers/user');

const router = express.Router();

// Public routes
router.post('/signin', login);
router.post('/signup', createUser);
router.get('/items', itemsRouter); // Fetch items

// Protected routes
router.use(auth); // Apply auth middleware
router.use('/users', usersRouter); // User routes
router.use('/items', itemsRouter); // Items routes (e.g., create, delete)

module.exports = router;

