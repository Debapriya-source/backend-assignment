const db = require("mysql2");
require("dotenv").config();

let pool = db
  .createPool({
    host: process.env.DB_HOST || "mysql",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || 1234,
    database: process.env.DATABASE || "backend_assignment",
  })
  .promise();

module.exports = pool;
