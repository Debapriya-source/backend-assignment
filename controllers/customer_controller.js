const pool = require("../database/connection");
const xlsx = require("xlsx");

const get_all_customers_query = `SELECT * FROM customer_data;`;
const register_customer_query = `INSERT INTO customer_data (customer_id, first_name, last_name, age,  monthly_salary, phone_number, approved_limit, current_debt) 
VALUES (?,?,?,?,?,?,?,?);`;
const get_customer_by_id = `select * from customer_data where customer_id=?;`;

async function get_all() {
  try {
    let [result] = await pool.query(get_all_customers_query);
    // console.log(result);
    return result;
  } catch (err) {
    console.error(err.message);
    throw new Error(err.message);
  }
}

async function get_by_id(id) {
  try {
    let [result] = await pool.query(get_customer_by_id, [id]);
    // console.log(result[0]);
    return result[0];
  } catch (err) {
    console.error(err.message);
    throw new Error(err.message);
  }
}

async function register(items) {
  try {
    let result = await pool.query(register_customer_query, items);
    // console.log(result);
    return result;
  } catch (err) {
    console.error(err.message);
    // throw new Error(err.message);
    return err.message;
  }
}

async function populate_customer_data(excelFilePath) {
  return new Promise((resolve, reject) => {
    // Read Excel file
    try {
      const workbook = xlsx.readFile(excelFilePath);
      const sheetName = workbook.SheetNames[0]; // As data is in the first sheet
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);
      resolve(data);
    } catch (error) {
      console.error("Error reading Excel file:", error);
      reject("Error reading Excel file");
    }
  }).then(async (data) => {
    // Populate database from Excel data
    data_arr = [];
    for (let row of data) {
      const arr = [];
      // Loop through each key in the object
      for (let key in row) {
        // Push the value of each key to the array
        arr.push(row[key]);
      }
      try {
        // console.log(arr);
        await register(arr);
      } catch (err) {
        console.error(err.message);
      }
      data_arr.push(arr);
    }
    return data_arr;
  });
}

module.exports = { register, get_all, get_by_id, populate_customer_data };
