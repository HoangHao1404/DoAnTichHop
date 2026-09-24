const express = require("express");
const cors = require("cors");
const authRoutes = require("./services/auth/auth.routes");
const userRoutes = require("./services/user/user.routes");
const reportRoutes = require("./routes/reportRoutes");
const geocodeRoutes = require("./routes/geocodeRoutes");
const incidentTypeRoutes = require("./routes/incidentTypeRoutes");
const maintenanceTeamRoutes = require("./routes/maintenanceTeamRoutes");
const statisticsRoutes = require("./routes/statisticsRoutes");
const areaRoutes = require("./routes/areaRoutes");

function createApp() {
  const app = express();

  // Lấy domain production từ biến môi trường (nếu có)
  const productionFrontend = process.env.FRONTEND_URL;

  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    ...(productionFrontend ? [productionFrontend] : [])
  ];

  const LOCALHOST_REGEX = /^http:\/\/localhost:\d+$/;
  const LOOPBACK_REGEX = /^http:\/\/127\.0\.0\.1:\d+$/;

  // Cấu hình CORS an toàn cho cả Local và Production
  app.use(
    cors({
      origin: (origin, callback) => {
        if (
          !origin ||
          allowedOrigins.includes(origin) ||
          LOCALHOST_REGEX.test(origin) ||
          LOOPBACK_REGEX.test(origin)
        ) {
          callback(null, true);
          return;
        }
        callback(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Tăng limit nhận request (hỗ trợ ảnh base64 lớn)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Đăng ký các Routes (Đảm bảo thống nhất chuẩn /api/users)
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/reports", reportRoutes);
  app.use("/api/geocode", geocodeRoutes);
  app.use("/api/maintenance-teams", maintenanceTeamRoutes);
  app.use("/api/areas", areaRoutes);
  app.use("/api/incident-types", incidentTypeRoutes);
  app.use("/api/statistics", statisticsRoutes);

  return app;
}

module.exports = { createApp };