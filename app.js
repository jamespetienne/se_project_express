const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Make sure CORS is properly imported
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Connected to Database");
  })
  .catch(console.error);

app.use(express.json());
app.use(cors()); // Enable CORS
app.use("/", mainRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});
