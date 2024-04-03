const pool = require("../database/connection");

const get_all_customers_query = `SELECT * FROM customer_data;`;
const register_customer_query = `INSERT INTO customer_data (customer_id, first_name, last_name, age, phone_number, monthly_salary, approved_limit, current_debt) 
VALUES (?,?,?,?,?,?,?,?);`;
const get_customer_by_id = `select * from customer_data where customer_id=?;`;

async function get_all() {
  try {
    let [result] = await pool.query(get_all_customers_query);
    console.log(result);
    return result;
  } catch (err) {
    console.error(err.message);
    throw new Error(err.message);
  }
}

async function get_by_id(id) {
  try {
    let [result] = await pool.query(get_customer_by_id, [id]);
    console.log(result[0]);
    return result[0];
  } catch (err) {
    console.error(err.message);
    throw new Error(err.message);
  }
}

async function register(items) {
  try {
    let result = await pool.query(register_customer_query, items);
    console.log(result);
    return result;
  } catch (err) {
    console.error(err.message);
    throw new Error(err.message);
  }
}

module.exports = { register, get_all, get_by_id };
