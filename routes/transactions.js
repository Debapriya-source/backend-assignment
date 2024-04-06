const express = require("express");
let router = express.Router();
const transaction = require("../controllers/transaction_controller");

//a middleware for printing called routes
router.use(async (req, res, next) => {
  console.log(req.url, "on", Date());
  next();
});

router.route("/make-payment/:customer_id/:loan_id").post(async (req, res) => {
  try {
    const payment_amount = req.body.payment_amount;
    const customer_id = req.params.customer_id;
    const loan_id = req.params.loan_id;
    const result = await transaction.make_payment([
      customer_id,
      loan_id,
      payment_amount,
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.route("/view-statement/:customer_id/:loan_id").get(async (req, res) => {
  try {
    const customer_id = req.params.customer_id;
    const loan_id = req.params.loan_id;
    const result = await transaction.view_statement(customer_id, loan_id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
