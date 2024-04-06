const {
  populate_customer_data,
} = require("../controllers/customer_controller");
const celery = require("celery-node");
require("dotenv").config();
// function worker() {
const MessageBrokerUrl = process.env.MESSAGE_BROKER_URL || "amqp://";
const ResultBackendUrl = process.env.RESULT_BACKEND_URL || "amqp://";

// Create a Celery worker with  URLs as strings
const worker = celery.createWorker(MessageBrokerUrl, ResultBackendUrl);

worker.register(
  "tasks.populate_customer_data",
  async (
    excelFilePath //excelFilePath
  ) => populate_customer_data(excelFilePath)
  // excelFilePath
);

console.log("Starting Celery customer worker...");
worker.start();
console.log("Celery customer worker started successfully.");
// }

// module.exports = worker();
