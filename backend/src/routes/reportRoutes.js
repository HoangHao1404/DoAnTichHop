const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/reportController");

// GET /api/reports - Lấy tất cả báo cáo
router.get("/", ReportController.getAllReports);

// GET /api/reports/:id - Lấy 1 báo cáo
router.get("/:id", ReportController.getReportById);

module.exports = router;
