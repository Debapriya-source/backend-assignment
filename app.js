const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 7000;
const db = require("./database/connection");

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Backend Assignment");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
