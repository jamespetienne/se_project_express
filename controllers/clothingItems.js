// const Item = require("../models/clothingItems");

// const {
//   defaultError,
//   castError,
//   documentNotFoundError,
// } = require("../utils/error");

// const getItems = (req, res) => {
//   Item.find({})
//     .then((items) => res.status(200).send(items))
//     .catch((err) => {
//       console.error(err);

//       return res
//         .status(defaultError)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

// const createItem = (req, res) => {
//   const { name, weather, imageUrl } = req.body;
//   const owner = req.user._id;

//   Item.create({ name, weather, imageUrl, owner })
//     .then((item) => res.status(201).send(item))
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "ValidationError") {
//         return res.status(castError).send({ message: "Invalid data" });
//       }
//       return res
//         .status(defaultError)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

// const deleteItem = (req, res) => {
//   Item.findByIdAndDelete(req.params.itemId)

//     .orFail()
//     .then((item) => res.status(200).send(item))
//     .catch((err) => {
//       console.error(err);

//       if (err.name === "DocumentNotFoundError") {
//         return res.status(documentNotFoundError).send({ message: err.message });
//       }
//       if (err.name === "CastError") {
//         return res.status(castError).send({ message: "Invalid data" });
//       }

//       return res
//         .status(defaultError)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

// const likeItem = (req, res) => {
//   const { itemId } = req.params;
//   Item.findByIdAndUpdate(
//     itemId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true }
//   )
//     .orFail()
//     .then((item) => res.status(200).send(item))
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "DocumentNotFoundError") {
//         return res.status(documentNotFoundError).send({ message: err.message });
//       }
//       if (err.name === "CastError") {
//         return res.status(castError).send({ message: "Invalid data" });
//       }
//       return res
//         .status(defaultError)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

// const dislikeItem = (req, res) => {
//   const { itemId } = req.params;
//   Item.findByIdAndUpdate(
//     itemId,
//     { $pull: { likes: req.user._id } },
//     { new: true }
//   )
//     .orFail()
//     .then((item) => res.status(200).send(item))
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "DocumentNotFoundError") {
//         return res.status(documentNotFoundError).send({ message: err.message });
//       }
//       if (err.name === "CastError") {
//         return res.status(castError).send({ message: "Invalid data" });
//       }
//       return res
//         .status(defaultError)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

// module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };

const Item = require("../models/clothingItems");
const { defaultError, documentNotFoundError } = require("../utils/error");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Invalid data" });
      }
      res.status(500).send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const currentUserId = req.user._id;

  Item.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }

      if (item.owner.toString() !== currentUserId) {
        return res
          .status(403)
          .send({ message: "You do not have permission to delete this item" });
      }

      return Item.findByIdAndDelete(itemId)
        .then((deletedItem) => res.status(200).send(deletedItem))
        .catch((err) => {
          console.error(err);
          res
            .status(500)
            .send({ message: "An error has occurred on the server" });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "An error has occurred on the server" });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  Item.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(500).send({ message: "An error has occurred on the server" });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  Item.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(500).send({ message: "An error has occurred on the server" });
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
