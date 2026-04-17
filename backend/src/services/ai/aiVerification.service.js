function buildModelApiCandidates() {
  const configured = (process.env.MODEL_API_URL || "").trim();
  const defaults = [
    "http://127.0.0.1:5001/predict",
    "http://localhost:5001/predict",
    "http://127.0.0.1:5000/predict",
    "http://localhost:5000/predict",
    "http://127.0.0.1:5000/api/predict",
  ];

  return [configured, ...defaults].filter((url, index, arr) => {
    return Boolean(url) && arr.indexOf(url) === index;
  });
}

function isHttpUrl(value) {
  return /^https?:\/\//i.test(String(value || "").trim());
}

function looksLikeBase64(value) {
  return /^[A-Za-z0-9+/=\r\n\s]+$/.test(value) && value.length % 4 === 0;
}

async function parseImageInput(imageInput) {
  if (typeof imageInput !== "string" || !imageInput.trim()) {
    throw new Error("Ảnh đầu vào không hợp lệ");
  }

  const value = imageInput.trim();

  if (isHttpUrl(value)) {
    const response = await fetch(value);
    if (!response.ok) {
      throw new Error(`Không tải được ảnh từ URL: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!buffer.length) {
      throw new Error("Ảnh URL rỗng hoặc không đọc được");
    }

    const mimeType = String(response.headers.get("content-type") || "image/jpeg")
      .split(";")[0]
      .trim()
      .toLowerCase();

    if (!mimeType.startsWith("image/")) {
      throw new Error("URL không trả về dữ liệu ảnh");
    }

    const extension = (mimeType.split("/")[1] || "jpg").split("+")[0];
    const fileName = `report-${Date.now()}-${Math.floor(Math.random() * 1000)}.${extension}`;

    return { buffer, mimeType, fileName };
  }

  const dataUrlMatch = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/i.exec(
    value,
  );

  const mimeType = dataUrlMatch ? dataUrlMatch[1].toLowerCase() : "image/jpeg";
  const rawBase64 = dataUrlMatch ? dataUrlMatch[2] : value;

  if (!dataUrlMatch && !looksLikeBase64(rawBase64)) {
    throw new Error("Ảnh đầu vào không phải base64 hoặc URL hợp lệ");
  }

  const sanitized = rawBase64.replace(/\s/g, "");
  const buffer = Buffer.from(sanitized, "base64");

  if (!buffer.length) {
    throw new Error("Không đọc được dữ liệu ảnh base64");
  }

  const extension = (mimeType.split("/")[1] || "jpg").split("+")[0];
  const fileName = `report-${Date.now()}-${Math.floor(Math.random() * 1000)}.${extension}`;

  return { buffer, mimeType, fileName };
}

async function requestModelPrediction(url, image) {
  const form = new FormData();
  const blob = new Blob([image.buffer], { type: image.mimeType });
  form.append("image", blob, image.fileName);

  const response = await fetch(url, {
    method: "POST",
    body: form,
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `Model API lỗi ${response.status} tại ${url}: ${text.slice(0, 200)}`,
    );
  }

  let payload;
  try {
    payload = JSON.parse(text);
  } catch (error) {
    throw new Error(`Model API không trả JSON hợp lệ tại ${url}`);
  }

  return payload;
}

function extractAiResult(payload, sourceUrl) {
  const detections = Array.isArray(payload?.detections)
    ? payload.detections
    : [];

  if (detections.length === 0) {
    return {
      aiVerified: true,
      aiPercent: 0,
      aiLabel: "No detection",
      aiTotalObjects: 0,
      aiSource: sourceUrl,
    };
  }

  const bestDetection = detections.reduce((best, current) => {
    const bestConfidence = Number(best?.confidence || 0);
    const currentConfidence = Number(current?.confidence || 0);
    return currentConfidence > bestConfidence ? current : best;
  }, detections[0]);

  const rawConfidence = Number(bestDetection?.confidence || 0);
  const normalizedPercent =
    rawConfidence > 0 && rawConfidence <= 1
      ? rawConfidence * 100
      : rawConfidence;

  return {
    aiVerified: true,
    aiPercent: Number(normalizedPercent.toFixed(2)),
    aiLabel: String(bestDetection?.class_name || "Unknown"),
    aiTotalObjects: Number(payload?.total_objects || detections.length || 0),
    aiSource: sourceUrl,
  };
}

async function verifyImageWithModel(base64Image) {
  if (!base64Image) {
    return {
      aiVerified: false,
      aiPercent: null,
      aiLabel: "",
      aiTotalObjects: 0,
      aiSource: null,
      aiError: "Không có ảnh để xác thực",
    };
  }

  let parsedImage;
  try {
    parsedImage = await parseImageInput(base64Image);
  } catch (error) {
    return {
      aiVerified: false,
      aiPercent: null,
      aiLabel: "",
      aiTotalObjects: 0,
      aiSource: null,
      aiError: error.message,
    };
  }

  const candidates = buildModelApiCandidates();
  const failures = [];

  for (const url of candidates) {
    try {
      const payload = await requestModelPrediction(url, parsedImage);
      return extractAiResult(payload, url);
    } catch (error) {
      failures.push(error.message);
    }
  }

  return {
    aiVerified: false,
    aiPercent: null,
    aiLabel: "",
    aiTotalObjects: 0,
    aiSource: null,
    aiError: failures[0] || "Không gọi được AI model",
  };
}

module.exports = {
  verifyImageWithModel,
};
