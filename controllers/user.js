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
const {
  BAD_REQUEST_ERROR,
  UNAUTHORIZED_ERROR,
  SERVER_ERROR,
  CONFLICT_ERROR,
  NOT_FOUND_ERROR,
} = require("../utils/error");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(CONFLICT_ERROR)
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
        return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  // Check if email or password is missing
  if (!email || !password) {
    return res
      .status(BAD_REQUEST_ERROR)
      .send({ message: "Email and password are required" });
  }

  // Proceed with authentication
  return User.findUserByCredentials(email, password) // Add return here
    .then((user) => {
      // If user is found, generate a token
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token }); // Return the response
    })
    .catch((err) => {
      // Check for incorrect email or password
      if (err.message === "Incorrect email or password") {
        return res
          .status(UNAUTHORIZED_ERROR)
          .send({ message: "Incorrect email or password" });
      }
      // Handle all other errors as server errors
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;

  return User.findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR).send({ message: "User not found" });
      }
      return res.send(user); // Always return a value
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR)
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
        return res.status(NOT_FOUND_ERROR).send({ message: "User not found" });
      }
      return res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { createUser, login, getCurrentUser, updateUser };
