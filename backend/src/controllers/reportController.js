const ReportRepository = require("../repositories/ReportRepository");

class ReportController {
  async getAllReports(req, res) {
    try {
      const reports = await ReportRepository.getAll();

      res.status(200).json({
        success: true,
        data: reports,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getReportById(req, res) {
    try {
      const { id } = req.params;
      const report = await ReportRepository.getById(id);

      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy báo cáo",
        });
      }

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getReportsByUserId(req, res) {
    try {
      const { userId } = req.params;
      console.log("🔍 Getting reports for userId:", userId);
      
      const reports = await ReportRepository.getByUserId(userId);
      console.log("✅ Found reports:", reports.length);

      res.status(200).json({
        success: true,
        data: reports,
      });
    } catch (error) {
      console.error("❌ Error in getReportsByUserId:", error.message);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async createReport(req, res) {
    try {
      const { title, type, location, description, images, userId } = req.body;
      console.log("📝 Creating report for userId:", userId);

      // Validate required fields
      if (!title || !type || !location || !userId) {
        return res.status(400).json({
          success: false,
          message: "Thiếu thông tin bắt buộc: title, type, location, userId",
        });
      }

      // Generate unique ID for report
      const reportId = `RPT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Get current time
      const currentTime = new Date().toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
      });

      const reportData = {
        id: reportId,
        userId,
        title,
        type,
        location,
        description: description || "",
        images: images || [],
        image: images && images.length > 0 ? images[0] : "",
        status: "Đang Chờ",
        time: currentTime,
      };

      const newReport = await ReportRepository.create(reportData);

      res.status(201).json({
        success: true,
        message: "Tạo báo cáo thành công",
        data: newReport,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new ReportController();
