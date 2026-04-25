require("dotenv").config();
const connectDB = require("./src/config/database");
const { createApp } = require("./src/app");

const app = createApp();
const PORT = process.env.BACKEND_PORT || 5050;
const ENABLE_MONGO = process.env.ENABLE_MONGO !== "false";

// Kết nối MongoDB
if (ENABLE_MONGO) {
  connectDB();
} else {
  console.log("MongoDB connection is disabled via ENABLE_MONGO=false");
}

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🔥 Server đang chạy tại http://localhost:${PORT}`);
  });
}

module.exports = app;
