const express = require("express");
const router = express.Router();
const TestReportController = require("../controllers/testReportController");

// Test workflow: create report -> save CSV -> get list from CSV
router.post("/", TestReportController.create);
router.get("/user/:userId", TestReportController.list);
router.get("/", TestReportController.list);

module.exports = router;
