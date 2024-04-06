const express = require("express");
let router = express.Router();
const celery = require("celery-node");
require("../workers/customer_data");
require("../workers/loan_data");
// const celeryClient = celery.createClient("amqp://rabbitmq:5672", "amqp://rabbitmq:5672");

// console.log("Client: ", celeryClient);

router.use(async (req, res, next) => {
  console.log("/ingest", req.url, "on", Date());
  next();
});

router.route("/customer_data").post(async (req, res) => {
  // console.log(req.body);
  let { excelFilePath } = req.body;
  // console.log(excelFilePath);
  // Trigger Celery task to parse Excel file and populate database
  try {
    const celeryClient = celery.createClient(
      "amqp://rabbitmq:5672",
      "amqp://rabbitmq:5672"
    );
    console.log("Loading customers");
    const task = celeryClient.createTask("tasks.populate_customer_data");
    console.log(task);
    const result = task.applyAsync([excelFilePath]);

    // console.log("res ", result);
    result.get().then((data) => {
      // console.log("client::::", data);
      celeryClient.disconnect();
    });
    res.json({ message: "Task triggered successfully", taskId: result.taskId });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.route("/loan_data").post(async (req, res) => {
  // console.log(req.body);
  let { excelFilePath } = req.body;
  console.log(excelFilePath);
  // Trigger Celery task to parse Excel file and populate database
  try {
    const celeryClient = celery.createClient(
      "amqp://rabbitmq:5672",
      "amqp://rabbitmq:5672"
    );
    console.log("Loading loans");
    const task = celeryClient.createTask("tasks.populate_loan_data");
    console.log(task);
    const result = task.applyAsync([excelFilePath]);

    // console.log("res ", result);
    result.get().then((data) => {
      console.log("client::::", data);
      celeryClient.disconnect();
    });
    res.json({ message: "Task triggered successfully", taskId: result.taskId });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
