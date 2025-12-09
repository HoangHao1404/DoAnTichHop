require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/database");
const authRoutes = require("./src/services/auth/auth.routes")

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:3000"].filter(Boolean),
    credentials: true,
  })
);

// Kết nối MongoDB
connectDB();

// Routes - phải khai báo TRƯỚC khi listen
app.use("/api/auth", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🔥 Server đang chạy tại http://localhost:${PORT}`);
});
