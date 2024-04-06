const express = require("express");
let router = express.Router();
const loan = require("../controllers/loan_controller");

//a middleware for printing called routes
router.use(async (req, res, next) => {
  console.log(req.url, "on", Date());
  next();
});

router.route("/all").get(async (req, res) => {
  try {
    const result = await loan.get_all();
    // console.log("result", result);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.route("/check-eligibility").post(async (req, res) => {
  const { customer_id, loan_ammount, interest_rate, tenure } = req.body;

  try {
    const result = await loan.eligibility([
      customer_id,
      loan_ammount,
      interest_rate,
      tenure,
    ]);
    res.status(200).json(result.loan_approval);
  } catch (err) {
    res.status(409).send(err.message);
  }
});

router.route("/view-loan/:id").get(async (req, res) => {
  try {
    const result = await loan.get_by_id(req.params.id);
    // console.log("result", result);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.route("/create-loan").post(async (req, res) => {
  const { customer_id, loan_ammount, interest_rate, tenure } = req.body;
  try {
    const result = await loan.create([
      customer_id,
      loan_ammount,
      interest_rate,
      tenure,
    ]);
    res.status(200).json(result);
  } catch (err) {
    res.status(409).send(err.message);
  }
});

module.exports = router;
