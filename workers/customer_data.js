const {
  populate_customer_data,
} = require("../controllers/customer_controller");

const celery = require("celery-node");

// function worker() {
const redisMessageBrokerUrl = "amqp://";
//"redis://127.0.0.1:6379/0";
const redisResultBackendUrl = "amqp://"; //"redis://127.0.0.1:6379/0";

// Create a Celery worker with Redis URLs as strings
const worker = celery.createWorker(
  redisMessageBrokerUrl, // Redis URL for message broker
  redisResultBackendUrl // Redis URL for result backend
);

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
