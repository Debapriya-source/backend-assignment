const db = require("mysql2");

var con = db.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "backend_assignment",
  //   port: "3306",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  const create_backend_assignment_db = "CREATE DATABASE backend_assignment";
  con.query(create_backend_assignment_db, function (err, result) {
    if (err) console.log(err.message);
    else console.log("Database created");
  });

  const select_backend_assignment_db = "USE backend_assignment";
  con.query(select_backend_assignment_db, function (err, result) {
    if (err) throw err;
    else console.log("Database selected: " + result.stateChanges.schema);
  });

  const create_customer_data =
    "CREATE TABLE customer_data (customer_id INT PRIMARY KEY, first_name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL, phone_number VARCHAR(15), monthly_salary DECIMAL(10, 2), approved_limit DECIMAL(10, 2), current_debt DECIMAL(10, 2));";
  con.query(create_customer_data, function (err, result) {
    if (err) console.log(err.message);
    else console.log("customer_data table created");
  });

  const describe_customer_data = "describe customer_data";
  con.query(describe_customer_data, function (err, result) {
    if (err) console.log(err.message);
    else console.log(result);
  });

  const create_loan_data =
    "CREATE TABLE loan_data (customer_id INT, loan_id INT PRIMARY KEY, loan_amount DECIMAL(10, 2), tenure INT, interest_rate DECIMAL(5, 2), monthly_repayment DECIMAL(10, 2), EMIs_paid_on_time INT, start_date DATE, end_date DATE);";
  con.query(create_loan_data, function (err, result) {
    if (err) console.log(err.message);
    else console.log("loan_data table created");
  });

  const describe_loan_data = "describe loan_data";
  con.query(describe_loan_data, function (err, result) {
    if (err) console.log(err.message);
    else console.log(result);
  });
});

module.exports = con;
