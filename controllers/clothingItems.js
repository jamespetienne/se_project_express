const Item = require("../models/clothingItems");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");

const getItems = async (req, res, next) => {
  try {
    const items = await Item.find({});
    return res.status(200).send(items);
  } catch (err) {
    return next(err);
  }
};

const createItem = async (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  try {
    const item = await Item.create({ name, weather, imageUrl, owner });
    return res.status(201).send(item);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data"));
    }
    return next(err);
  }
};

const deleteItem = async (req, res, next) => {
  const { itemId } = req.params;
  const currentUserId = req.user._id;

  try {
    const item = await Item.findById(itemId);

    if (!item) {
      throw new NotFoundError("Item not found");
    }

    if (item.owner.toString() !== currentUserId) {
      throw new ForbiddenError(
        "You do not have permission to delete this item"
      );
    }

    const deletedItem = await Item.findByIdAndDelete(itemId);
    return res.status(200).send(deletedItem);
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID"));
    }
    return next(err);
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
      return next(new NotFoundError("Item not found"));
    }

    return res.status(200).send(item);
  } catch (err) {
    return next(err);
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
      return next(new NotFoundError("Item not found"));
    }

    return res.status(200).send(item);
  } catch (err) {
    return next(err);
  }
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
