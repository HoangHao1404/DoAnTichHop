const express = require("express");
const router = express.Router();
const {
  register,
  login,
  googleLogin,
  sendForgotPasswordOtp,
  resetPassword,
  logout,
  verify,
} = require("./auth.controller");
const requireAuth = require("../../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/forgot-password/send-otp", sendForgotPasswordOtp);
router.post("/forgot-password/reset", resetPassword);
router.post("/logout", requireAuth, logout);
router.get("/verify", requireAuth, verify);

module.exports = router;
