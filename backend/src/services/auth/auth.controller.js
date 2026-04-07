const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpService = require("./otp.service");
const userRepo = require("../user/user.repository");

// 1) Gửi OTP đăng ký
async function sendRegisterOtp(req, res) {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Thiếu số điện thoại" });
    }

    const exists = await userRepo.findByPhone(phone);
    if (exists) {
      return res
        .status(400)
        .json({ message: "Số điện thoại đã được đăng ký" });
    }

    const code = otpService.generateOtp(phone);
    console.log(`🔐 OTP cho ${phone}: ${code}`);

    return res.json({
      success: true,
      message: "Đã tạo OTP (demo). Kiểm tra console server.",
      otp_demo: code,
    });
  } catch (err) {
    console.error("sendRegisterOtp error:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
}

// 2) Confirm OTP + tạo user
async function confirmRegister(req, res) {
  try {
    const { phone, otp, password, full_name } = req.body;

    if (!phone || !otp || !password) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }

    const valid = otpService.verifyOtp(phone, otp);
    if (!valid) {
      return res
        .status(400)
        .json({ message: "OTP không hợp lệ hoặc đã hết hạn" });
    }

    const exists = await userRepo.findByPhone(phone);
    if (exists) {
      return res
        .status(400)
        .json({ message: "Số điện thoại đã được đăng ký" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user_id = await userRepo.getNextUserId();

    const user = await userRepo.create({
      user_id,
      full_name,
      phone,
      password: hashed,
      phone_verified: true,
      role: "citizen",
    });

    return res.status(201).json({
      success: true,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("confirmRegister error:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
}

// 3) Login: phone + password (chỉ user đã verify)
async function login(req, res) {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res
        .status(400)
        .json({ message: "Thiếu số điện thoại hoặc mật khẩu" });
    }

    const user = await userRepo.findByPhone(phone);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Sai số điện thoại hoặc mật khẩu" });
    }

    if (!user.phone_verified) {
      return res
        .status(403)
        .json({ message: "Số điện thoại chưa được xác thực" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res
        .status(400)
        .json({ message: "Sai số điện thoại hoặc mật khẩu" });
    }

    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "1h" }
    );

    return res.json({
      success: true,
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
}

module.exports = {
  sendRegisterOtp,
  confirmRegister,
  login,
};
