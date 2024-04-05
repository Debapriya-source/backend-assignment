const express = require("express");
let router = express.Router();
const loan = require("../controllers/loan_controller");

//a middleware for printing called routes
router.use(async (req, res, next) => {
  console.log("/", req.url, "on", Date());
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

router.route("/create-loan").post(async (req, res) => {
  const {} = req.body;

  console.log("create-loan");

  try {
    res.status(200).json("create-loan");
    //     await loan.register([
    //       customer_id,
    //       loan_id,
    //       loan_amount,
    //       tenure,
    //       interest_rate,
    //       monthly_repayment,
    //       EMIs_paid_on_time,
    //       start_date,
    //       end_date,
    //     ]);
    //     const result = await loan.get_by_id(loan_id);
    //     res.status(201).json(result);
  } catch (err) {
    res.status(409).send(err.message);
  }
});

module.exports = router;
