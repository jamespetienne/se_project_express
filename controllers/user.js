// const User = require("../models/user");

// const {
//   defaultError,
//   castError,
//   documentNotFoundError,
// } = require("../utils/error");

// const getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.status(200).send(users))
//     .catch((err) => {
//       console.error(err);

//       return res
//         .status(defaultError)
//         .send({ message: "An error has occured on the server" });
//     });
// };

// const createUser = (req, res) => {
//   const { name, avatar } = req.body;

//   User.create({ name, avatar })
//     .then((user) => res.status(201).send(user))
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "ValidationError") {
//         return res.status(castError).send({ message: "Invalid data" });
//       }
//       return res
//         .status(defaultError)
//         .send({ message: "An error has occured on the server" });
//     });
// };

// const getUser = (req, res) => {
//   const { userId } = req.params;
//   User.findById(userId)

//     .orFail()
//     .then((user) => res.status(200).send(user))
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
//         .send({ message: "An error has occured on the server" });
//     });
// };

// module.exports = { getUsers, createUser, getUser };

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(409)
          .send({ message: "User with this email already exists" });
      }

      return bcrypt
        .hash(password, 10)
        .then((hashedPassword) =>
          User.create({ name, avatar, email, password: hashedPassword })
        )
        .then((user) =>
          res
            .status(201)
            .send({ name: user.name, avatar: user.avatar, email: user.email })
        );
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Invalid data" });
      }
      return res
        .status(500)
        .send({ message: "An error has occurred on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      return res.status(401).send({ message: "Incorrect email or password" });
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      return res.send(user);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .send({ message: "An error has occurred on the server" });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      return res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Invalid data" });
      }
      return res
        .status(500)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { createUser, login, getCurrentUser, updateUser };
