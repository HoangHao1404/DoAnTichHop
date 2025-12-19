const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/reportController");

// GET /api/reports - Lấy tất cả báo cáo
router.get("/", ReportController.getAllReports);

// GET /api/reports/user/:userId - Lấy báo cáo của 1 user (phải đặt trước /:id)
router.get("/user/:userId", ReportController.getReportsByUserId);

// POST /api/reports - Tạo báo cáo mới
router.post("/", ReportController.createReport);

// GET /api/reports/:id - Lấy 1 báo cáo (phải đặt sau /user/:userId)
router.get("/:id", ReportController.getReportById);

module.exports = router;
