require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/database");
const authRoutes = require("./src/services/auth/auth.routes");
const reportRoutes = require("./src/routes/reportRoutes");

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - ✅ Cho phép tất cả origin trong development
app.use(
  cors({
    origin: true, // ✅ Đơn giản hóa: cho phép tất cả (chỉ dùng khi dev)
    credentials: true,
  })
);

// Kết nối MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🔥 Server đang chạy tại http://localhost:${PORT}`);
});
