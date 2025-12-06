const express = require("express");
const router = express.Router();
const {
  sendRegisterOtp,
  confirmRegister,
  login,
} = require("./auth.controller");

router.post("/register/send-otp", sendRegisterOtp);
router.post("/register/confirm", confirmRegister);
router.post("/login", login);

module.exports = router;
