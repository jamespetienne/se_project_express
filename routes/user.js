const express = require("express");
const { getCurrentUser, updateUser } = require("../controllers/user");

const router = express.Router();

// Route to get current user info
router.get("/me", getCurrentUser);

// Route to update current user's info
router.patch("/me", updateUser);

module.exports = router;
