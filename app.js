const express = require("express");
let bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 7000;
// require("./database/connection");
require("./database/initiate_database_and_tables");
const customer = require("./routes/customer");

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", customer);

app.get("/", (req, res) => {
  res.send("Backend Assignment");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
