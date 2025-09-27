const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const route = require("./router/route");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/user", route);

mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("DB Connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server Connected to PORT: ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log("DB Connection Failed", err));
