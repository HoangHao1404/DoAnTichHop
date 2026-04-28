const ReportRepository = require("../repositories/ReportRepository");
const IncidentTypeRepository = require("../repositories/IncidentTypeRepository");
const { verifyAllImages } = require("../services/ai/aiVerification.service");
const { extractExifFromImages } = require("../services/exif/exif.service");
const { validateCreateReportPayload } = require("../utils/reportValidation");

class ReportController {
  async getManagementReports(req, res) {
    try {
      const {
        search = "",
        type = "all",
        status = "all",
        page = 1,
        limit = 10,
      } = req.query;

      const result = await ReportRepository.getManagementList({
        search,
        type,
        status,
        page,
        limit,
      });

      res.status(200).json({
        success: true,
        data: result.items,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

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
      const validation = validateCreateReportPayload(req.body);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          code: "VALIDATION_ERROR",
          message: validation.message,
        });
      }

      const {
        title,
        type: incomingType,
        location,
        description,
        images,
        userId,
        latitude,
        longitude,
      } = validation.data;

      const authUserId = req.user?.id;
      if (!authUserId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (String(userId) !== String(authUserId)) {
        return res.status(403).json({
          success: false,
          message: "Bạn không thể tạo báo cáo cho người dùng khác",
        });
      }

      console.log("📝 Creating report for userId:", userId);

      await IncidentTypeRepository.ensureDefaults();
      const incidentType =
        await IncidentTypeRepository.findActiveByName(incomingType);

      if (!incidentType) {
        return res.status(400).json({
          success: false,
          code: "INVALID_INCIDENT_TYPE",
          message: "Loại sự cố không hợp lệ hoặc đã bị xóa",
        });
      }

      // Generate unique ID for report
      const reportId = `RPT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Get current time
      const reportCreatedAt = new Date();
      const currentTime = reportCreatedAt.toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
      });

      let exifMetadata = null;
      try {
        exifMetadata = await extractExifFromImages(images, {
          reportLatitude: latitude,
          reportLongitude: longitude,
          reportTime: reportCreatedAt,
        });
      } catch (exifError) {
        console.warn("EXIF parsing failed:", exifError.message);
      }

      // AI xác thực TẤT CẢ ảnh theo spec AI_Image_Validation_Workflow.md
      const aiVerification = await verifyAllImages(images);

      if (!aiVerification.allPassed) {
        const failedImageNumber = (aiVerification.failedIndex ?? 0) + 1;

        // Phân biệt timeout vs AI từ chối
        if (aiVerification.isTimeout) {
          return res.status(422).json({
            success: false,
            code: "AI_SERVICE_UNAVAILABLE",
            message:
              "Hệ thống AI tạm thời không khả dụng, vui lòng thử lại sau",
          });
        }

        return res.status(422).json({
          success: false,
          code: "AI_VALIDATION_FAILED",
          message:
            aiVerification.aiError ||
            `Ảnh thứ ${failedImageNumber} không liên quan đến sự cố hạ tầng đô thị, vui lòng chụp lại`,
        });
      }

      // Lấy summary AI từ ảnh đầu tiên để lưu vào DB
      const aiSummary = aiVerification.summary;

      const reportData = {
        report_id: reportId,
        id: reportId,
        userId: String(authUserId),
        title,
        type: incidentType.name,
        location,
        reportLatitude: latitude,
        reportLongitude: longitude,
        description,
        images,
        image: images[0],
        status: "Đang Chờ",
        time: currentTime,
        aiPercent: aiSummary.aiPercent,
        aiVerified: aiSummary.aiVerified,
        aiLabel: aiSummary.aiLabel,
        aiTotalObjects: aiSummary.aiTotalObjects,
        aiSource: aiSummary.aiSource || "",
        exifMetadata,
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
