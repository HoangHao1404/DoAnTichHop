const fs = require("fs");
const path = require("path");
const {
  ensureStorage,
  getNextNumericId,
  appendRow,
  readAllRows,
} = require("../test-report/testReportStore");

const MODEL_API_URL =
  process.env.MODEL_API_URL || "http://127.0.0.1:5001/api/predict";

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return parsed;
}

function clampPercent(value) {
  const parsed = toNumber(value, 0);
  return Math.min(Math.max(parsed, 0), 100);
}

function calculateAverageAiPercent(rawDamageValue, potholeCountValue) {
  const rawDamage = Math.max(toNumber(rawDamageValue, 0), 0);
  const potholeCount = Math.max(Math.floor(toNumber(potholeCountValue, 1)), 1);

  // Trường hợp 1: raw dạng tỷ lệ 0..1 (ví dụ 0.65)
  if (rawDamage >= 0 && rawDamage <= 1) {
    return clampPercent(rawDamage * 100);
  }

  // Trường hợp 2: raw là tổng tỷ lệ nhiều ổ gà (ví dụ 3.5 với 5 ổ)
  if (potholeCount > 1 && rawDamage >= 0 && rawDamage <= potholeCount) {
    return clampPercent((rawDamage / potholeCount) * 100);
  }

  // Trường hợp 3: raw đã là phần trăm tổng (0..100), lấy trung bình theo số ổ
  if (rawDamage <= 100) {
    return clampPercent(rawDamage / potholeCount);
  }

  // Trường hợp dữ liệu lỗi >100, vẫn chia theo count rồi chặn trần.
  return clampPercent(rawDamage / potholeCount);
}

function normalizeStoredAiPercent(storedValue, potholeCountValue) {
  const parsed = toNumber(storedValue, 0);
  const potholeCount = Math.max(Math.floor(toNumber(potholeCountValue, 1)), 1);

  // Tương thích dữ liệu cũ từng lưu dạng 0.x
  if (parsed > 0 && parsed <= 1) {
    return clampPercent(parsed * 100);
  }

  // Tương thích dữ liệu lỗi từng lưu >100 (ví dụ 244.33)
  if (parsed > 100) {
    return clampPercent(parsed / potholeCount);
  }

  return clampPercent(parsed);
}

function getDamageLevel(aiPercent) {
  if (aiPercent >= 70) {
    return "Nặng";
  }

  if (aiPercent >= 30) {
    return "Trung bình";
  }

  return "Nhẹ";
}

function isIsoDateString(value) {
  if (typeof value !== "string" || !value) {
    return false;
  }

  const parsed = Date.parse(value);
  return !Number.isNaN(parsed);
}

function normalizeLegacyCsvRow(row) {
  // Schema cũ: ... imagePath, damageLevel, aiPercent, createdAt
  // Schema mới: ... imagePath, potholeCount, damageLevel, aiPercent, createdAt
  // Nếu row.createdAt rỗng và row.aiPercent là date ISO -> row đang ở schema cũ.
  if (!row.createdAt && isIsoDateString(row.aiPercent)) {
    return {
      ...row,
      potholeCount: "1",
      damageLevel: row.potholeCount || "",
      aiPercent: row.damageLevel || "0",
      createdAt: row.aiPercent,
    };
  }

  return row;
}

function dataUrlToBuffer(dataUrl) {
  if (typeof dataUrl !== "string") {
    throw new Error("Invalid image format");
  }

  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Image must be base64 data URL");
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, "base64");

  return { mimeType, buffer };
}

function mimeTypeToExtension(mimeType) {
  if (mimeType.includes("png")) return "png";
  if (mimeType.includes("webp")) return "webp";
  return "jpg";
}

async function callAiModel(imageBuffer, fileName, mimeType) {
  const formData = new FormData();
  const blob = new Blob([imageBuffer], { type: mimeType || "image/jpeg" });
  formData.append("file", blob, fileName);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(MODEL_API_URL, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok || payload.success === false) {
      throw new Error(payload.error || payload.message || "Model call failed");
    }

    const detections = Array.isArray(payload.detections)
      ? payload.detections
      : [];
    const confidenceValues = detections
      .map((item) => toNumber(item?.confidence, Number.NaN))
      .filter((value) => Number.isFinite(value) && value >= 0);

    // Ưu tiên đúng yêu cầu: lấy trung bình confidence của các ổ gà.
    let aiPercentFromDetections = null;
    if (confidenceValues.length > 0) {
      const avgConfidence =
        confidenceValues.reduce((sum, value) => sum + value, 0) /
        confidenceValues.length;
      aiPercentFromDetections = clampPercent(avgConfidence * 100);
    }

    return {
      rawDamage: toNumber(payload.damage_percentage, 0),
      potholeCount: Math.max(Math.floor(toNumber(payload.num_potholes, 0)), 0),
      aiPercentFromDetections,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

class TestReportController {
  async create(req, res) {
    try {
      const {
        userId,
        title = "Báo cáo test",
        type = "CTCC",
        location = "Chưa cập nhật vị trí",
        description = "",
        images = [],
      } = req.body || {};

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "Thiếu userId",
        });
      }

      if (!description || !String(description).trim()) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập mô tả",
        });
      }

      if (!Array.isArray(images) || images.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng tải lên ít nhất 1 ảnh",
        });
      }

      const { uploadDir } = ensureStorage();
      const { mimeType, buffer } = dataUrlToBuffer(images[0]);
      const extension = mimeTypeToExtension(mimeType);
      const imageFileName = `test-report-${Date.now()}-${Math.floor(Math.random() * 10000)}.${extension}`;
      const absoluteImagePath = path.join(uploadDir, imageFileName);

      fs.writeFileSync(absoluteImagePath, buffer);

      let rawDamage = 0;
      let potholeCount = 0;
      let aiPercentFromDetections = null;
      try {
        const modelResult = await callAiModel(buffer, imageFileName, mimeType);
        rawDamage = modelResult.rawDamage;
        potholeCount = modelResult.potholeCount;
        aiPercentFromDetections = modelResult.aiPercentFromDetections;
      } catch (modelError) {
        return res.status(502).json({
          success: false,
          message: `Không gọi được model AI: ${modelError.message}`,
        });
      }

      const safePotholeCount = Math.max(potholeCount, 1);
      const aiPercent =
        aiPercentFromDetections !== null
          ? aiPercentFromDetections
          : calculateAverageAiPercent(rawDamage, safePotholeCount);
      const roundedAiPercent = Number(aiPercent.toFixed(2));
      const damageLevel = getDamageLevel(roundedAiPercent);

      const numericId = getNextNumericId();
      const createdAt = new Date().toISOString();
      const imagePath = path.join(
        "test-data",
        "reports",
        "uploads",
        imageFileName,
      );

      appendRow({
        id: String(numericId),
        userId: String(userId),
        title: String(title),
        type: String(type),
        location: String(location),
        status: "Đang Chờ",
        description: String(description),
        imagePath,
        potholeCount: String(safePotholeCount),
        damageLevel,
        aiPercent: String(roundedAiPercent.toFixed(2)),
        createdAt,
      });

      return res.status(201).json({
        success: true,
        message: "Tạo báo cáo test thành công",
        data: {
          id: `TEST-${numericId}`,
          userId: String(userId),
          title: String(title),
          type: String(type),
          location: String(location),
          status: "Đang Chờ",
          description: String(description),
          imagePath,
          potholeCount: safePotholeCount,
          rawDamage: Number(rawDamage.toFixed(4)),
          damageLevel,
          aiPercent: roundedAiPercent,
          createdAt,
          time: new Date(createdAt).toLocaleString("vi-VN"),
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async list(req, res) {
    try {
      const { userId } = req.params;
      const rows = readAllRows();

      const filtered = userId
        ? rows.filter((row) => String(row.userId) === String(userId))
        : rows;

      const mapped = filtered
        .map((rawRow) => {
          const row = normalizeLegacyCsvRow(rawRow);
          const createdAt = row.createdAt || new Date().toISOString();
          const potholeCount = Math.max(
            Math.floor(toNumber(row.potholeCount, 1)),
            1,
          );
          const aiPercent = Number(
            normalizeStoredAiPercent(row.aiPercent || 0, potholeCount).toFixed(
              2,
            ),
          );
          const numericId = row.id || "0";
          const damageLevel = getDamageLevel(aiPercent);

          return {
            id: `TEST-${numericId}`,
            report_id: `TEST-${numericId}`,
            userId: row.userId,
            title: row.title || "Báo cáo test",
            type: row.type || "CTCC",
            location: row.location || "Chưa có vị trí",
            status: row.status || "Đang Chờ",
            description: row.description || "",
            imagePath: row.imagePath || "",
            potholeCount,
            damageLevel,
            aiPercent,
            createdAt,
            time: row.createdAt
              ? new Date(createdAt).toLocaleString("vi-VN")
              : "",
          };
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.status(200).json({
        success: true,
        data: mapped,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new TestReportController();
