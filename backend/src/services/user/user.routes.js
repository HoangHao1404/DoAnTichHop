const express = require("express");
const requireAuth = require("../../middleware/auth");
const { updateProfile, changePassword } = require("./user.controller");

const router = express.Router();

router.put("/profile", requireAuth, updateProfile);
router.put("/change-password", requireAuth, changePassword);

module.exports = router;
