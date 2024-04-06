function calculate_monthly_installment(loan_amount, interest_rate, tenure) {
  const principal = parseFloat(loan_amount);
  const annualInterestRate = parseFloat(interest_rate) / 100;
  const monthlyInterestRate = annualInterestRate / 12;
  const numberOfPayments = tenure;

  // Calculate monthly installment using the formula for amortizing loans
  const monthly_installment =
    (principal *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  return monthly_installment;
}

function generate_random_integer(length) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function normalize_credit_score(
  average_emis_paid_on_time,
  total_number_of_loans
) {
  // Normalize average EMIs paid on time to a percentage score (0 to 100)
  const average_emis_paid_on_time_score = Math.min(
    100,
    average_emis_paid_on_time * 100
  );

  // Normalize total number of loans to a percentage score (0 to 100)
  const total_number_of_loans_score = Math.max(
    0,
    100 - total_number_of_loans * 20
  ); // Assuming each loan decreases the score by 20

  // Weight for each component (adjust as needed)
  const weight_average_emis = 0.7;
  const weight_total_loans = 0.3;

  // Calculate the weighted sum to get the final credit score
  const credit_score =
    average_emis_paid_on_time_score * weight_average_emis +
    total_number_of_loans_score * weight_total_loans;

  return Math.round(credit_score); // Round to the nearest integer
}

function calculate_end_date(tenure) {
  const start_date = new Date(); // Today's date
  const end_date = new Date(start_date); // Create a copy of start date

  // Add the tenure (in months) to the start date
  end_date.setMonth(end_date.getMonth() + tenure);

  return [start_date, end_date];
}
module.exports = {
  calculate_monthly_installment,
  normalize_credit_score,
  calculate_end_date,
  generate_random_integer,
};
