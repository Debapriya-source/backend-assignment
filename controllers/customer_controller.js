const pool = require("../database/connection");

const get_all_customers_query = `SELECT * FROM customer_data;`;
const register_customer_query = `INSERT INTO Students (customer_id, first_name, last_name, age, phone_number, monthly_salary, approved_limit, current_debt) 
VALUES (?,?,?,?,?,?,?,?);`;

async function get_all() {
  try {
    let [result] = await pool.query(get_all_customers_query);
    console.log(result);
  } catch (err) {
    console.error(err.message);
  }
}

async function register(items) {
  try {
    let [result] = await pool.query(register_customer_query, items);
    console.log(result);
  } catch (err) {
    console.error(err.message);
  }
}

module.exports = { register, get_all };
