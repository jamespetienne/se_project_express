// const express = require("express");
// const mongoose = require("mongoose");
// const mainRouter = require("./routes/index");

// const app = express();
// const { PORT = 3001 } = process.env;

// mongoose
//   .connect("mongodb://127.0.0.1:27017/wtwr_db")
//   .then(() => {
//     console.log("Connected to Database");
//   })
//   .catch(console.error);

// app.use((req, res, next) => {
//   req.user = {
//     _id: "66da78fec706f31748e97494",
//   };
//   next();
// });

// app.use(express.json());
// app.use("/", mainRouter);

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import CORS middleware
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to Database"))
  .catch(console.error);

app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use("/", mainRouter); // Use the main router

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
