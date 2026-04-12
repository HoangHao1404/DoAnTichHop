const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const authMiddleware = require("../../middleware/auth");
const requireRole = require("../../middleware/role");

// GET /api/user/profile - Láº¥y thÃ´ng tin cÃ¡ nhÃ¢n
router.get("/profile", authMiddleware, userController.getProfile);

// PUT /api/user/profile - Cáº­p nháº­t thÃ´ng tin cÃ¡ nhÃ¢n
router.put("/profile", authMiddleware, userController.updateProfile);

// POST /api/user/change-password - Äá»•i máº­t kháº©u
router.post("/change-password", authMiddleware, userController.changePassword);

// DELETE /api/user/account - XÃ³a tÃ i khoáº£n
router.delete("/account", authMiddleware, userController.deleteAccount);

// GET /api/user/all - Láº¥y danh sÃ¡ch táº¥t cáº£ user (chá»‰ admin)
router.get("/all", authMiddleware, requireRole("admin"), userController.getAllUsers);

// GET /api/user/management - Danh sÃ¡ch user cho trang quáº£n lÃ½
router.get(
	"/management",
	authMiddleware,
	requireRole("admin", "manager"),
	userController.getManagementUsers
);

// POST /api/user/management - Táº¡o user tá»« trang quáº£n lÃ½
router.post(
	"/management",
	authMiddleware,
	requireRole("admin", "manager"),
	userController.createManagementUser
);

// PUT /api/user/management/:userId - Sá»­a user tá»« trang quáº£n lÃ½
router.put(
	"/management/:userId",
	authMiddleware,
	requireRole("admin", "manager"),
	userController.updateManagementUser
);

// PATCH /api/user/management/:userId/status - KhÃ³a/má»Ÿ khÃ³a user
router.patch(
	"/management/:userId/status",
	authMiddleware,
	requireRole("admin", "manager"),
	userController.updateManagementUserStatus
);

// DELETE /api/user/management/:userId - XÃ³a user
router.delete(
	"/management/:userId",
	authMiddleware,
	requireRole("admin", "manager"),
	userController.deleteManagementUser
);

module.exports = router;
