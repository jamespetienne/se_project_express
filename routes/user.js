const express = require("express");
const { celebrate, Joi, Segments } = require("celebrate");
const { getCurrentUser, updateUser } = require("../controllers/user");

const router = express.Router();

// Validation schema for updating user info
const updateUserSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string()
      .required()
      .regex(/^(https?:\/\/)(www\.)?[\w\-~:/?#[\]@!$&'()*+,;=.%]+$/i)
      .message("Must be a valid URL"),
  }),
});

// Route to get current user info
router.get("/me", getCurrentUser);

// Route to update current user's info with validation
router.patch("/me", updateUserSchema, updateUser);

module.exports = router;
