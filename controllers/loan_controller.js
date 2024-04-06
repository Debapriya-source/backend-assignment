const pool = require("../database/connection");
const customer = require("../controllers/customer_controller");
const xlsx = require("xlsx");
const {
  calculate_monthly_installment,
  normalize_credit_score,
  calculate_end_date,
  generate_random_integer,
} = require("../utils/loan_utils");

const get_all_loan_query = `SELECT * FROM loan_data;`;
const register_loan_query = `INSERT INTO loan_data (customer_id, loan_id, loan_amount, tenure, interest_rate, monthly_repayment, EMIs_paid_on_time, start_date, end_date) 
VALUES (?,?,?,?,?,?,?,?,?);`;
const get_loan_by_id_query = `select * from loan_data where loan_id=?;`;
const get_loan_by_customer_id_query = `select * from loan_data where customer_id=?;`;

async function get_all() {
  try {
    let [result] = await pool.query(get_all_loan_query);
    // console.log(result);
    return result;
  } catch (err) {
    console.error(err.message);
    return { error: err.message };
  }
}

async function get_by_id(id) {
  try {
    let [result] = await pool.query(get_loan_by_id_query, [id]);
    result = result[0];
    let customer_details = await customer.get_by_id(result.customer_id);
    // if (customer) {
    // console.log(result.customer_id);
    result["customer"] = customer_details ? customer_details : {};
    // }
    // console.log(result);

    return result;
  } catch (err) {
    console.error(err.message);
    throw new Error(err.message);
  }
}

async function get_by_customer_id(id) {
  // console.log(id);
  try {
    let [result] = await pool.query(get_loan_by_customer_id_query, [id]);
    // console.log(result);
    return result;
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

// async function create([customer_id, loan_ammount, interest_rate, tenure]) {
//   let loan_id = customer_id * 1000;
//   let loan_approved = eligibility([
//     customer_id,
//     loan_ammount,
//     interest_rate,
//     tenure,
//   ]).approval;
//   let message = loan_approved
//     ? "Your loan is approved"
//     : "Your loan is not approved";
//   let monthly_installments = loan_approved ? loan_ammount / tenure : 0;

//   return {
//     loan_id: loan_id,
//     customer_id: customer_id,
//     loan_approved: loan_approved,
//     message: message,
//     monthly_installments: monthly_installments,
//   };
// }

async function eligibility(items) {
  let [customer_id, loan_amount, interest_rate, tenure] = items;
  // Check loan eligibility based on credit score of customers (out
  //   of 100) based on the historical loan data from “loan_data.xlsx”,
  //   consider the following components while assigning a credit
  //   score:
  //   i. Past Loans paid on time
  //   ii. No of loans taken in past
  //   iii. Loan activity in current year
  //   iv. Loan approved volume
  //   v. If sum of current loans of customer > approved limit of
  //   customer, credit score = 0
  let customer_details = {};
  let loan_details = {};
  try {
    // console.log("ID: ", customer_id);
    customer_details = await customer.get_by_id(customer_id);
    // console.log(
    //   "customer found in the database while checking eligibility ",
    //   customer_details
    // );
  } catch (error) {
    console.log(
      "Couldn't find customer while checking eligibility",
      error.message
    );
  }

  try {
    loan_details = await get_by_customer_id(customer_id);
    // console.log(
    //   "previous loan(s) found in the database while checking eligibility ",
    //   loan_details
    // );
  } catch (error) {
    console.log("Couldn't find loan while checking eligibility", error.message);
  }

  let credit_details = calculate_credit_score(customer_details, loan_details);
  // console.log(credit_details);
  const loan_approval = approve_loan(
    credit_details.credit_score,
    customer_id,
    loan_amount,
    interest_rate,
    tenure,
    customer_details,
    loan_details
  );
  // console.log({
  //   loan_approval: loan_approval,
  //   message: credit_details.message,
  // });
  console.log(
    `For customer ${customer_id} with loan amount ${loan_amount}, interest rate ${interest_rate}%, tenure ${tenure} the loan is ${
      loan_approval.approval ? "approved" : "not approved"
    }`
  );
  return { loan_approval: loan_approval, message: credit_details.message };
}

async function create(items) {
  const [customer_id, loan_amount, interest_rate, tenure] = items;
  let output = {
    loan_id: null,
    customer_id: customer_id,
    loan_approved: false,
    message: "",
    monthly_installment: null,
  };
  const approval = await eligibility(items);
  const isApproved = approval.loan_approval.approval;
  console.log("approval", isApproved, approval);
  if (isApproved) {
    let new_loan_id = generate_random_integer(5) + customer_id + tenure;
    output.loan_id = new_loan_id;
    output.loan_approved = true;
    output.message = "Approval is based on credit score: " + approval.message;
    output.monthly_installment = approval.loan_approval.monthly_installment;
    // console.log(output);
    // customer_id, loan_id, loan_amount, tenure, interest_rate, monthly_repayment, EMIs_paid_on_time, start_date, end_date

    const [start_date, end_date] = calculate_end_date(tenure);
    register_loan_items = [
      customer_id,
      new_loan_id,
      loan_amount,
      tenure,
      approval.loan_approval.corrected_interest_rate,
      approval.loan_approval.monthly_installment,
      0,
      start_date,
      end_date,
    ];
    let new_register = {};
    try {
      console.log("Registering new loan with id " + new_loan_id);
      await register(register_loan_items);
      new_register = await get_by_id(new_loan_id);
    } catch (err) {
      console.log("Couldn't register new loan. ", err.message);
    }
    if (new_register.loan_id == null) {
      console.log("Invalid_loan"); //, new_register);
      return { error: "Invalid loan" };
    } else {
      console.log("New loan registered successfully with id " + new_loan_id); //, output, new_register);
      return output;
    }
  }
  return output;
}

function calculate_credit_score(customer_details, loan_details) {
  let credit_score = 0;
  if (!loan_details || loan_details.length === 0) {
    if (customer_details) {
      const approvedLimit = parseFloat(customer_details.approved_limit);
      const currentDebt = parseFloat(customer_details.current_debt);
      let credit_score =
        approvedLimit < currentDebt
          ? 0
          : ((approvedLimit - currentDebt) / approvedLimit) * 100;
      return {
        credit_score: credit_score,
        message:
          "No past loan records found. This score is based on approved limit and current debt.",
      };
    } else return { credit_score: 0, message: "No past records found!" };
  }

  // i. Past Loans paid on time
  const totalEMIsPaidOnTime = loan_details.reduce(
    (total, loan) => total + loan.EMIs_paid_on_time,
    0
  );
  const averageEMIsPaidOnTime = totalEMIsPaidOnTime / loan_details.length;

  // ii. No of loans taken in past
  const number_of_loans = loan_details.length;

  // iii. Loan activity in current year
  const currentYear = new Date().getFullYear();
  const currentYearLoans = loan_details.filter(
    (loan) => new Date(loan.start_date).getFullYear() === currentYear
  );

  // iv. Loan approved volume
  let approvedLimit = 0;
  if (customer_details) {
    approvedLimit = parseFloat(customer_details.approved_limit);
  }
  // const currentDebt = parseFloat(customer_details.current_debt);
  const currentLoansAmount = currentYearLoans.reduce(
    (total, loan) => total + parseFloat(loan.loan_amount),
    0
  );

  // v. If sum of current loans of customer > approved limit of customer, credit score = 0
  if (approvedLimit != 0) {
    if (currentLoansAmount > approvedLimit) {
      credit_score = 0;
    }
  } else {
    // Calculate credit score based on the given components
    credit_score = normalize_credit_score(
      averageEMIsPaidOnTime,
      number_of_loans
    );
    // Math.round(
    //   (averageEMIsPaidOnTime / 100) * 300 + (number_of_loans / 2) * 100
    // );
  }
  // console.log(credit_score);

  return {
    credit_score: credit_score,
    message: "based on the past loan records.",
  };
}

function approve_loan(
  credit_score,
  customer_id,
  loan_amount,
  interest_rate,
  tenure,
  customer_details,
  loan_details
) {
  //   Based on the credit score of the customer, approve loans as per the following:
  // ▪ If credit score > 50, approve loan
  // ▪ If 50 > credit score > 30, approve loans with interest rate
  // > 12%
  // ▪ If 30> credit score > 10, approve loans with interest rate
  // >16%
  // ▪ If 10> credit score, don’t approve any loans
  // ▪ If sum of all current EMIs > 50% of monthly salary, don’t
  // approve any loans
  // ▪ If the interest rate does not match as per credit limit,
  // correct the interest rate in the response, i.e suppose
  // credit score is calculated to be 20 for a particular loan
  // and the interest_rate is 8%, send a
  // corrected_interest_rate = 16% (lowest of slab) in the
  // response body, corrected
  // console.log("Credit Score: "+credit_score);
  const output = {
    customer_id: customer_id,
    approval: false,
    interest_rate: parseFloat(interest_rate),
    corrected_interest_rate: interest_rate,
    tenure: tenure,
    monthly_installment: null,
  };

  // Check if sum of all current EMIs > 50% of monthly salary
  if (loan_details.length > 0 && customer_details) {
    const totalCurrentEMIs = loan_details.reduce(
      (total, loan) => total + loan.EMIs_paid_on_time,
      0
    );
    const monthlySalary = parseFloat(customer_details.monthly_salary);
    if (totalCurrentEMIs > 0.5 * monthlySalary) {
      return output; // Don't approve loans
    }
  }
  // Approve loans based on credit score and interest rate
  if (credit_score > 50) {
    output.approval = true;
  } else if (credit_score > 30 && parseFloat(interest_rate) > 12) {
    output.approval = true;
  } else if (credit_score > 10 && parseFloat(interest_rate) > 16) {
    output.approval = true;
  }

  // Correct interest rate if necessary
  if (!output.approval && parseFloat(interest_rate) < 16) {
    output.corrected_interest_rate = 16;
  }

  // Calculate monthly installment if loan is approved
  if (output.approval) {
    output.monthly_installment = calculate_monthly_installment(
      loan_amount,
      interest_rate,
      tenure
    );
  }

  return output;
}

module.exports = {
  register,
  get_all,
  get_by_id,
  populate_loan_data,
  create,
  eligibility,
  get_by_customer_id,
  // create_loan,
};
