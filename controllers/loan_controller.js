const pool = require("../database/connection");
const xlsx = require("xlsx");
const get_all_loan_query = `SELECT * FROM loan_data;`;
const register_loan_query = `INSERT INTO loan_data (customer_id, loan_id, loan_amount, tenure, interest_rate, monthly_repayment, EMIs_paid_on_time, start_date, end_date) 
VALUES (?,?,?,?,?,?,?,?,?);`;
const get_loan_by_id = `select * from loan_data where loan_id=?;`;

async function get_all() {
  try {
    let [result] = await pool.query(get_all_loan_query);
    // console.log(result);
    return result;
  } catch (err) {
    console.error(err.message);
    throw new Error(err.message);
  }
}

async function get_by_id(id) {
  try {
    let [result] = await pool.query(get_loan_by_id, [id]);
    // console.log(result[0]);
    return result[0];
  } catch (err) {
    console.error(err.message);
    throw new Error(err.message);
  }
}

async function register(items) {
  try {
    await pool.query(`SET FOREIGN_KEY_CHECKS = 0;`);
    let result = await pool.query(register_loan_query, items);
    // console.log(result);
    return result;
  } catch (err) {
    console.error(err.message);
    // throw new Error(err.message);
    return err.message;
  } finally {
    await pool.query(`SET FOREIGN_KEY_CHECKS = 1;`);
  }
}

async function populate_loan_data(excelFilePath) {
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
    // console.log("Populating loan database", data);
    data_arr = [];
    for (let row of data) {
      const arr = [];
      // Loop through each key in the object
      for (let key in row) {
        // Push the value of each key to the array
        if (key === "Date of Approval" || key === "End Date") {
          row[key] = new Date((row[key] - (25567 + 1)) * 86400 * 1000);
        }
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

    // console.log(data_arr);
    console.log("Data loaded successfully");
    return data_arr;
  });
}

module.exports = { register, get_all, get_by_id, populate_loan_data };
