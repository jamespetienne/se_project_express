const express = require("express");
const { celebrate, Joi, Segments } = require("celebrate");
const {
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const router = express.Router();

// Validation schema for creating an item
const createItemSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    weather: Joi.string().required().valid("hot", "cold", "mild"),
    imageUrl: Joi.string()
      .required()
      .regex(/^(https?:\/\/)(www\.)?[\w\-~:/?#[\]@!$&'()*+,;=.%]+$/i)
      .message("Must be a valid URL"),
  }),
});

// Validation schema for itemId parameter
const itemIdSchema = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});

// Routes with validation
router.post("/", createItemSchema, createItem);
router.delete("/:itemId", itemIdSchema, deleteItem);
router.put("/:itemId/likes", itemIdSchema, likeItem);
router.delete("/:itemId/likes", itemIdSchema, dislikeItem);

module.exports = router;
