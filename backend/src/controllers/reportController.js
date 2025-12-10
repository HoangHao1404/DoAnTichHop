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
}

module.exports = new ReportController();
