const customer = require("./controllers/customer_controller");
const loan = require("./controllers/loan_controller");

// const customer = require("./customer_controller");
// const loan = require("./loan_controller");

let input_json = {
  customer_id: 35, //1011, //
  loan_ammount: 50000,
  interest_rate: 5.5,
  tenure: 10,
};

let input_array = [];
for (let key in input_json) {
  input_array.push(input_json[key]);
}
// console.log(input_array);

loan.eligibility(input_array);
loan.create_loan(input_array);
