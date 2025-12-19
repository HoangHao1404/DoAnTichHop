require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/database");
const authRoutes = require("./src/services/auth/auth.routes");
const reportRoutes = require("./src/routes/reportRoutes");
const geocodeRoutes = require("./src/routes/geocodeRoutes");

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// CORS - Phải đặt trước các middleware khác
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware - Tăng limit cho JSON và URL encoded để nhận ảnh base64
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Kết nối MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/geocode", geocodeRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🔥 Server đang chạy tại http://localhost:${PORT}`);
});
