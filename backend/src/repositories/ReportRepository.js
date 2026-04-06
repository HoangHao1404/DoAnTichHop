const Report = require("../models/Report");

class ReportRepository {
  /**
   * Lấy báo cáo cho trang quản lý (có lọc + phân trang)
   */
  async getManagementList({ search, type, status, page = 1, limit = 10 }) {
    try {
      const query = {};

      if (type && type !== "all") {
        query.type = type;
      }

      if (status && status !== "all") {
        query.status = status;
      }

      if (search) {
        const keyword = search.trim();
        query.$or = [
          { id: { $regex: keyword, $options: "i" } },
          { report_id: { $regex: keyword, $options: "i" } },
          { title: { $regex: keyword, $options: "i" } },
        ];
      }

      const safePage = Math.max(parseInt(page, 10) || 1, 1);
      const safeLimit = Math.max(parseInt(limit, 10) || 10, 1);
      const skip = (safePage - 1) * safeLimit;

      const [items, total] = await Promise.all([
        Report.find(query).sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
        Report.countDocuments(query),
      ]);

      return {
        items,
        pagination: {
          page: safePage,
          limit: safeLimit,
          total,
          totalPages: Math.max(Math.ceil(total / safeLimit), 1),
        },
      };
    } catch (error) {
      throw new Error("Lỗi khi lấy danh sách quản lý báo cáo: " + error.message);
    }
  }

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
      return await Report.findOne({ $or: [{ id }, { report_id: id }] });
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
