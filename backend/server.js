const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./src/config/database");
const { createApp } = require("./src/app");

const app = createApp();
const PORT = process.env.PORT || process.env.BACKEND_PORT || 5000;
const ENABLE_MONGO = process.env.ENABLE_MONGO !== "false";

// Health check endpoint phục vụ giám sát Cloud/Docker
app.get("/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "CONNECTED" : "DISCONNECTED";
  res.status(dbStatus === "CONNECTED" ? 200 : 503).json({
    status: dbStatus === "CONNECTED" ? "OK" : "FAIL",
    database: dbStatus,
    timestamp: new Date()
  });
});

// Hàm khởi động an toàn: kết nối DB thành công trước khi mở cổng nhận request
async function startServer() {
  try {
    if (ENABLE_MONGO) {
      await connectDB();
      console.log(" Kết nối MongoDB thành công!");
    } else {
      console.log("MongoDB connection is disabled");
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại port ${PORT}`);
    });
  } catch (err) {
    console.error("LỖI NGHIÊM TRỌNG: Không thể kết nối MongoDB, hủy khởi động server!", err.message);
    process.exit(1); // Dừng tiến trình ngay lập tức để tránh lỗi ảo
  }
}

startServer();