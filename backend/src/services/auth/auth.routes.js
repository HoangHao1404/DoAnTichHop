const express = require("express");
const router = express.Router();
const {
  sendRegisterOtp,
  confirmRegister,
  login,
  googleLogin,
} = require("./auth.controller");

router.post("/register/send-otp", sendRegisterOtp);
router.post("/register/confirm", confirmRegister);
router.post("/login", login);
router.post("/google-login", googleLogin);

module.exports = router;
