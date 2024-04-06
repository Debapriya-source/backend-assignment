const { get } = require("../routes/loan");

//customer queries
const get_all_customers_query = `SELECT * FROM customer_data;`;
const register_customer_query = `INSERT INTO customer_data (customer_id, first_name, last_name, age,  monthly_salary, phone_number, approved_limit, current_debt) 
VALUES (?,?,?,?,?,?,?,?);`;
const get_customer_by_id = `select * from customer_data where customer_id=?;`;

//loan queries
const get_all_loan_query = `SELECT * FROM loan_data;`;
const register_loan_query = `INSERT INTO loan_data (customer_id, loan_id, loan_amount, tenure, interest_rate, monthly_repayment, EMIs_paid_on_time, start_date, end_date) 
VALUES (?,?,?,?,?,?,?,?,?);`;
const get_loan_by_id = `select * from loan_data where loan_id=?;`;
const get_loan_by_customer_id = `select * from loan_data where customer_id=?;`;

module.exports = {
  get_all_customers_query,
  register_customer_query,
  get_customer_by_id,
  get_all_loan_query,
  register_loan_query,
  get_loan_by_id,
  get_loan_by_customer_id,
};
