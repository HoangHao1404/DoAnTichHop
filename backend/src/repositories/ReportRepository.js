const Report = require("../models/Report");

class ReportRepository {
  /**
   * Lấy tất cả báo cáo
   */
  async getAll() {
    try {
      return await Report.find({}).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error("Lỗi khi lấy danh sách báo cáo: " + error.message);
    }
  }
  async getById(id) {
    try {
      return await Report.findOne({ id });
    } catch (error) {
      throw new Error("Lỗi khi lấy báo cáo: " + error.message);
    }
  }

  /**
   * Lấy tất cả báo cáo của một user
   */
  async getByUserId(userId) {
    try {
      return await Report.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error("Lỗi khi lấy báo cáo của user: " + error.message);
    }
  }

  /**
   * Tạo báo cáo mới
   */
  async create(reportData) {
    try {
      const report = new Report(reportData);
      return await report.save();
    } catch (error) {
      throw new Error("Lỗi khi tạo báo cáo: " + error.message);
    }
  }
}

module.exports = new ReportRepository();
