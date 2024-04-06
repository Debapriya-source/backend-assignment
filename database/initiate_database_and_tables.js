const pool = require("./connection");

const create_backend_assignment_db_query = `CREATE DATABASE IF NOT EXISTS backend_assignment`;
const select_backend_assignment_db_query = `USE backend_assignment`;
const create_customer_data_query = `CREATE  TABLE IF NOT EXISTS customer_data (customer_id INT PRIMARY KEY, first_name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL, age INT, phone_number INT, monthly_salary DECIMAL(20, 2), approved_limit DECIMAL(20, 2), current_debt DECIMAL(20, 2));`;
const describe_customer_data_query = `describe customer_data`;
const create_loan_data_query = `CREATE TABLE IF NOT EXISTS loan_data (customer_id INT, loan_id INT PRIMARY KEY, loan_amount DECIMAL(20, 2), tenure INT, interest_rate DECIMAL(5, 2), monthly_repayment DECIMAL(20, 2), EMIs_paid_on_time INT, start_date DATE, end_date DATE, FOREIGN KEY (customer_id) REFERENCES customer_data(customer_id));`;
const describe_loan_data_query = `describe loan_data`;
const create_payment_data_query = `CREATE TABLE IF NOT EXISTS payment_data (payment_id INT PRIMARY KEY AUTO_INCREMENT, customer_id INT, loan_id INT, amount_paid	decimal(20,2), payment_date DATE, FOREIGN KEY (loan_id) REFERENCES loan_data(loan_id));`;
const describe_payment_data_query = `describe payment_data`;

async function create_backend_assignment_db() {
  try {
    let [result] = await pool.query(create_backend_assignment_db_query);
    console.log("create_backend_assignment db");
  } catch (err) {
    console.log(err.message);
  }
}

async function select_backend_assignment_db() {
  try {
    let [result] = await pool.query(select_backend_assignment_db_query);
    console.log("SELECT backend_assignment db");
    // console.log(result);
  } catch (err) {
    console.log(err.message);
  }
}

async function create_customer_data() {
  try {
    let [result] = await pool.query(create_customer_data_query);
    console.log("create_customer_data table\n");
    // console.log(result);
  } catch (err) {
    console.log(err.message);
  }
}

async function describe_customer_data() {
  try {
    let [rows] = await pool.query(describe_customer_data_query);
    console.log("describe_customer_data", rows);
  } catch (err) {
    console.log(err.message);
  }
}

async function create_loan_data() {
  try {
    let [result] = await pool.query(create_loan_data_query);
    console.log("create_loan_data table\n");
    // console.log(result);
  } catch (err) {
    console.log(err.message);
  }
}

async function describe_loan_data() {
  try {
    [rows] = await pool.query(describe_loan_data_query);
    console.log("describe_loan_data table\n", rows);
  } catch (err) {
    console.log(err.message);
  }
}

async function create_payment_data() {
  try {
    let [result] = await pool.query(create_payment_data_query);
    console.log("create_payment_data table\n");
    // console.log(result);
  } catch (err) {
    console.log(err.message);
  }
}

async function describe_payment_data() {
  try {
    [rows] = await pool.query(describe_payment_data_query);
    console.log("describe_payment_data table\n", rows);
  } catch (err) {
    console.log(err.message);
  }
}

async function inititiate_db() {
  console.log("inititiate_db table starting...");
  await create_backend_assignment_db();
  await select_backend_assignment_db();
  await create_customer_data();
  // await describe_customer_data();
  await create_loan_data();
  // await describe_loan_data();
  await create_payment_data();
  // await describe_payment_data();
  console.log("inititiate_db table complete.");
}

module.exports = inititiate_db();
