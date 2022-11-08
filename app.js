express = require("express");
const app = express();
const mongoose = require("mongoose");
const usersRoutes = require("./routes/usersRoutes");
const usersAuth = require("./routes/auth");
const cardsR = require("./routes/cartdsRoutes");
const morgan = require("morgan");

mongoose
  .connect("mongodb://localhost:27017/node-final-project")
  .then(() => {
    console.log("mongoDB is running ! ");
  })
  .catch((err) => {
    console.error("could not connect to mongoDB", err);
  });
app.use(morgan("dev"));
app.use(express.json());

app.use("/maor2022/usersRoutes", usersRoutes);
app.use("/maor2022/auth", usersAuth);
app.use("/maor2022/cartdsRoutes", cardsR);

app.listen(3000, () => {
  console.log("this server is running on port 3000");
});
