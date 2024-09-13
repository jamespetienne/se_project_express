const router = require("express").Router();

const usersRouter = require("./user");
const itemsRouter = require("./clothingItems");

const { documentNotFoundError } = require("../utils/error");

router.use("/users", usersRouter);
router.use("/items", itemsRouter);

router.use((req, res) => {
  res.status(documentNotFoundError).send({ message: "Router not found" });
});

module.exports = router;
