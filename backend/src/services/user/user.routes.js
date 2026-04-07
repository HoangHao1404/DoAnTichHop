const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const authMiddleware = require("../../middleware/auth");

// GET /api/user/profile - Lấy thông tin cá nhân
router.get("/profile", authMiddleware, userController.getProfile);

// PUT /api/user/profile - Cập nhật thông tin cá nhân
router.put("/profile", authMiddleware, userController.updateProfile);

// POST /api/user/change-password - Đổi mật khẩu
router.post("/change-password", authMiddleware, userController.changePassword);

// DELETE /api/user/account - Xóa tài khoản
router.delete("/account", authMiddleware, userController.deleteAccount);

// GET /api/user/all - Lấy danh sách tất cả user (chỉ admin)
router.get("/all", userController.getAllUsers);

module.exports = router;
