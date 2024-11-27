const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");

const createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    res
      .status(201)
      .send({ name: user.name, avatar: user.avatar, email: user.email });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data"));
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.send({ token });
  } catch (err) {
    next(err); // Pass error to centralized handler
  }
};

const getCurrentUser = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const user = await User.findById(_id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.send(user);
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid user ID"));
    }
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;

  try {
    const user = await User.findByIdAndUpdate(
      _id,
      { name, avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.send(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data"));
    }
    next(err);
  }
};

module.exports = { createUser, login, getCurrentUser, updateUser };
