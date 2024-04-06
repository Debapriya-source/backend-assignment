const { populate_loan_data } = require("../controllers/loan_controller");
const celery = require("celery-node");
require("dotenv").config();
// function worker() {

const MessageBrokerUrl = process.env.MESSAGE_BROKER_URL || "amqp://5672";
const ResultBackendUrl = process.env.RESULT_BACKEND_URL || "amqp://5672";
const worker = celery.createWorker(MessageBrokerUrl, ResultBackendUrl);

worker.register("tasks.populate_loan_data", async (excelFilePath) => {
  console.log("worker ", excelFilePath);
  populate_loan_data(excelFilePath);
});

console.log("Starting Celery loan worker...");
worker.start();
console.log("Celery loan worker started successfully.");
// }

// module.exports = worker();
