const Item = require("../models/clothingItems");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");

const getItems = async (req, res, next) => {
  try {
    const items = await Item.find({});
    res.status(200).send(items);
  } catch (err) {
    next(err); // Pass any unhandled error to the error handler
  }
};

const createItem = async (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  try {
    const item = await Item.create({ name, weather, imageUrl, owner });
    res.status(201).send(item);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data"));
    }
    next(err);
  }
};

const deleteItem = async (req, res, next) => {
  const { itemId } = req.params;

  try {
    const item = await Item.findById(itemId);

    if (!item) {
      throw new NotFoundError("Item not found");
    }

    const deletedItem = await Item.findByIdAndDelete(itemId);
    res.status(200).send(deletedItem);
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID"));
    }
    next(err);
  }
};

const likeItem = async (req, res, next) => {
  const { itemId } = req.params;

  try {
    const item = await Item.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    if (!item) {
      throw new NotFoundError("Item not found");
    }

    res.status(200).send(item);
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID"));
    }
    next(err);
  }
};

const dislikeItem = async (req, res, next) => {
  const { itemId } = req.params;

  try {
    const item = await Item.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    if (!item) {
      throw new NotFoundError("Item not found");
    }

    res.status(200).send(item);
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID"));
    }
    next(err);
  }
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
