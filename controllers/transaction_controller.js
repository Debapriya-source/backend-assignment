const customer = require("../controllers/customer_controller");
const loan = require("../controllers/loan_controller");
const pool = require("../database/connection");
const { calculate_monthly_installment } = require("../utils/loan_utils");

const get_by_loan_id_query = `select * from payment_data where loan_id =?`;
const make_payment_query = `insert into payment_data (customer_id, loan_id, amount_paid, payment_date) values(?,?,?,?)`;
const update_emi_query = `update loan_data set monthly_repayment=? where loan_id =?`;

async function get_by_loan_id(loan_id) {
  try {
    let [result] = await pool.query(get_by_loan_id_query, [loan_id]);
    // console.log(result);
    return result;
  } catch (err) {
    console.error(err.message);
    return { error: err.message };
  }
}

async function make_payment(items) {
  const [customer_id, loan_id, payment] = items;
  //   console.log(payment);
  const payment_date = new Date();
  items.push(payment_date);

  let current_details = {};
  try {
    const [result] = await pool.query(make_payment_query, items);
    //calculating new monthly_installments
    try {
      current_details = await view_statement(customer_id, loan_id);

      let { principal, interest_rate, amount_paid } = current_details;
      let { tenure } = await loan.get_by_id(loan_id);
      let payment_amount_left = principal - amount_paid + payment;
      let new_monthly_installments = calculate_monthly_installment(
        payment_amount_left,
        interest_rate,
        tenure
      );
      //   console.log(new_monthly_installments);
      await pool.query(update_emi_query, [new_monthly_installments, loan_id]);
    } catch (err) {
      console.log("No payment records found for loan " + loan_id);
    }
    return {
      payment_id: result.insertId,
      message: "payment successful and new emi calculated",
    };
  } catch (err) {
    // console.log("Payment not done: ", err.message);
    throw err;
    // return { error: "Error while making payment" + err.message };
  }
}

async function view_statement(customer_id, loan_id) {
  let loan_details = {};
  try {
    loan_details = await loan.get_by_id(loan_id);
    // console.log(loan_details);
  } catch (error) {
    console.log("Couldn't find loan while checking statement", error.message);
    // return { error: error.message };
    throw error;
  }
  if (
    loan_details.customer.customer_id &&
    loan_details.customer.customer_id != customer_id
  )
    return { error: "customer_id is not linked to this loan id" };
  const principal = loan_details.loan_amount;
  const interest_rate = loan_details.interest_rate;
  let payment_history = [];
  try {
    payment_history = await get_by_loan_id(loan_id);
    // console.log(payment_history);
    if (payment_history.length === 0) throw new Error();
  } catch (err) {
    console.log("Couldn't find payment history for loan_id:", loan_id);
    throw new Error(
      "Couldn't find payment history for loan_id:" + loan_id + err.message
    );
  }
  //   console.log("Payment history");
  const total_amount_paid = payment_history.reduce(
    (total, payment) => total + parseFloat(payment.amount_paid),
    0
  );
  //   console.log(total_amount_paid);
  //   const total_emis = payment_history.length;
  const monthly_installments = loan_details.monthly_repayment;
  const repayments_left = parseInt(
    (principal - total_amount_paid) / monthly_installments
  );
  //   console.log("viewing statement");
  return {
    customer_id: customer_id,
    loan_id: loan_id,
    principal: principal,
    interest_rate: interest_rate,
    amount_paid: total_amount_paid,
    monthly_installments: monthly_installments,
    repayments_left: repayments_left,
  };
}

module.exports = { make_payment, view_statement };
