const express = require("express");
let router = express.Router();
const customer = require("../controllers/customer_controller");

//a middleware for printing called routes
router.use(async (req, res, next) => {
  console.log("/", req.url, "on", Date());
  // let token = req.get("authorization");
  // // console.log(token);
  // try {
  //   if (token === undefined) throw new Error("Unexpected token");
  //   req.uid = (await userAutherization(token.split(" ")[1])).uid;
  //   // console.log("uid", req.uid);
  // } catch (err) {
  //   res.json({ message: err.message });
  // }
  next();
});

router.route("/all").get((req, res) => {
  try {
    const result = customer.get_all();
    console.log("result", result);
    res.json({ message: result });
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.route("/register").post((req, res) => {
  const {
    customer_id,
    first_name,
    last_name,
    age,
    monthly_income,
    phone_number,
    // approved_limit,
    current_debt,
  } = req.body;

  appproved_limit = 36 * monthly_income;

  try {
    const result = customer.register([
      customer_id,
      first_name,
      last_name,
      age,
      phone_number,
      monthly_salary,
      approved_limit,
      current_debt,
    ]);
    res.json(result);
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
