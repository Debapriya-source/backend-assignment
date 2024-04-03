const pool = require("./connection");

const create_backend_assignment_db_query = `CREATE DATABASE backend_assignment`;
const select_backend_assignment_db_query = `USE backend_assignment`;
const create_customer_data_query = `CREATE TABLE customer_data (customer_id INT PRIMARY KEY, first_name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL, age INT, phone_number INT, monthly_salary DECIMAL(10, 2), approved_limit DECIMAL(10, 2), current_debt DECIMAL(10, 2));`;
const describe_customer_data_query = `describe customer_data`;
const create_loan_data_query = `CREATE TABLE loan_data (customer_id INT, loan_id INT PRIMARY KEY, loan_amount DECIMAL(10, 2), tenure INT, interest_rate DECIMAL(5, 2), monthly_repayment DECIMAL(10, 2), EMIs_paid_on_time INT, start_date DATE, end_date DATE);`;
const describe_loan_data_query = `describe loan_data`;

async function create_backend_assignment_db() {
  try {
    let [result] = await pool.query(create_backend_assignment_db_query);
    console.log(result);
  } catch (err) {
    console.log(err.message);
  }
}

async function select_backend_assignment_db() {
  try {
    let [result] = await pool.query(select_backend_assignment_db_query);
    console.log(result);
  } catch (err) {
    console.log(err.message);
  }
}

async function create_customer_data() {
  try {
    let [result] = await pool.query(create_customer_data_query);
    console.log(result);
  } catch (err) {
    console.log(err.message);
  }
}

async function describe_customer_data() {
  try {
    let [rows] = await pool.query(describe_customer_data_query);
    console.log(rows);
  } catch (err) {
    console.log(err.message);
  }
}

async function create_loan_data() {
  try {
    let [result] = await pool.query(create_loan_data_query);
    console.log(result);
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

async function inititiate_db() {
  create_backend_assignment_db();
  select_backend_assignment_db();
  create_customer_data();
  describe_customer_data();
  create_loan_data();
  describe_loan_data();
}

module.exports = inititiate_db();
