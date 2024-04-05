const { populate_loan_data } = require("../controllers/loan_controller");

const celery = require("celery-node");

// function worker() {
const worker = celery.createWorker("amqp://", "amqp://");

worker.register("tasks.populate_loan_data", async (excelFilePath) => {
  console.log("worker ", excelFilePath);
  populate_loan_data(excelFilePath);
});

console.log("Starting Celery loan worker...");
worker.start();
console.log("Celery loan worker started successfully.");
// }

// module.exports = worker();
