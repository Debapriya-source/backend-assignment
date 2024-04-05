const express = require("express");
let router = express.Router();
const customer = require("../controllers/customer_controller");

//a middleware for printing called routes
router.use(async (req, res, next) => {
  console.log("/", req.url, "on", Date());
  next();
});

router.route("/all").get(async (req, res) => {
  try {
    const result = await customer.get_all();
    // console.log("result", result);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.route("/register").post(async (req, res) => {
  const {
    customer_id,
    first_name,
    last_name,
    age,
    monthly_income,
    phone_number,
    current_debt,
  } = req.body;

  approved_limit = 36 * monthly_income;

  try {
    await customer.register([
      customer_id,
      first_name,
      last_name,
      age,
      phone_number,
      monthly_income,
      approved_limit,
      current_debt,
    ]);
    const result = await customer.get_by_id(customer_id);
    res.status(201).json(result);
  } catch (err) {
    res.status(409).send(err.message);
  }
});

module.exports = router;
