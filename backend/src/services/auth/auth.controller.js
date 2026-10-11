const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const passwordResetEmailService = require("./passwordResetEmail.service");
const userRepo = require("../user/user.repository");
const User = require("../user/user.model");
const LoginHistory = require("./loginHistory.model");

const GMAIL_EMAIL_PATTERN = /^[^\s@]+@gmail\.com$/i;
const STRONG_PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function isStrongPassword(password) {
  return STRONG_PASSWORD_PATTERN.test(String(password || ""));
}

// 1) Đăng ký bằng Gmail
async function register(req, res) {
  try {
    const { password, full_name } = req.body;
    const email = normalizeEmail(req.body?.email);

    if (!email || !password || !full_name) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }

    if (!GMAIL_EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ message: "Vui lòng nhập địa chỉ Gmail hợp lệ" });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: "mật khẩu không đủ mạnh" });
    }

    const exists = await userRepo.findByEmail(email);
    if (exists) {
      return res.status(400).json({ message: "Gmail đã được đăng ký" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user_id = await userRepo.getNextUserId();

    const user = await userRepo.create({
      user_id,
      full_name: typeof full_name === "string" ? full_name.trim() : full_name,
      email,
      password: hashed,
      email_verified: true,
      role: "user",
    });

    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
}

// 3) Login: Gmail + password
async function login(req, res) {
  try {
    const email = normalizeEmail(req.body?.email);
    const { password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Thiếu Gmail hoặc mật khẩu" });
    }

    if (!GMAIL_EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ message: "Vui lòng nhập địa chỉ Gmail hợp lệ" });
    }

    const user = await userRepo.findByEmail(email);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Sai Gmail hoặc mật khẩu" });
    }

    // Kiểm tra tài khoản có bị khóa tạm thời không
    if (user.lock_until && user.lock_until > Date.now()) {
      const remainingMinutes = Math.ceil((user.lock_until - Date.now()) / 60000);
      return res.status(403).json({
        message: `Tài khoản đã bị khóa tạm thời. Vui lòng thử lại sau ${remainingMinutes} phút.`,
      });
    }

    if (user.account_status && user.account_status !== "active") {
      return res
        .status(403)
        .json({ message: "Tài khoản đã bị khóa hoặc cấm" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      // Đăng nhập sai - tăng counter
      const newFailedAttempts = (user.failed_login_attempts || 0) + 1;
      
      if (newFailedAttempts >= 3) {
        // Khóa tài khoản 15 phút
        const lockTime = new Date(Date.now() + 15 * 60 * 1000);
        await userRepo.updateLoginAttemptsByEmail(email, newFailedAttempts, lockTime);
        return res.status(403).json({
          message: "Đã nhập sai mật khẩu 3 lần. Tài khoản bị khóa 15 phút.",
        });
      }
      
      await userRepo.updateLoginAttemptsByEmail(email, newFailedAttempts);
      const attemptsLeft = 3 - newFailedAttempts;
      return res.status(400).json({
        message: `Sai Gmail hoặc mật khẩu. Còn ${attemptsLeft} lần thử.`,
      });
    }

    // Đăng nhập thành công - reset counter
    await userRepo.updateLoginAttemptsByEmail(email, 0, null);

    // LẤY USER MỚI NHẤT TỪ DB ĐỂ ĐẢM BẢO token_version
    const freshUser = await User.findOne({ email }).lean();
    
    if (!freshUser) {
      console.error(`❌ [LOGIN] Failed to fetch freshUser for email: ${email}`);
      return res.status(500).json({ message: "Lỗi lấy dữ liệu người dùng" });
    }
    
    // Ensure token_version exists in DB (set to 0 if undefined)
    if (freshUser.token_version === undefined || freshUser.token_version === null) {
      console.log(`⚠️  [LOGIN] token_version was undefined, updating to 0...`);
      await User.findOneAndUpdate(
        { email },
        { $set: { token_version: 0 } },
        { new: false }
      );
      freshUser.token_version = 0;
    }
    
    console.log(`🔓 [LOGIN] User ${freshUser.user_id} authenticated`);
    console.log(`🔓 [LOGIN] Fresh token_version from DB: ${freshUser.token_version}`);

    const token = jwt.sign(
      { 
        id: freshUser.user_id, 
        role: freshUser.role,
        token_version: freshUser.token_version || 0
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "1h" },
    );

    console.log(`🔓 [LOGIN] JWT created with token_version: ${freshUser.token_version || 0}`);

    return res.json({
      success: true,
      token,
      user: {
        user_id: freshUser.user_id,
        full_name: freshUser.full_name,
        email: freshUser.email,
        role: freshUser.role,
        is_first_login: freshUser.is_first_login || false,
      },
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
}

// 4) Google Login: verify token + gửi email xác thực
async function googleLogin(req, res) {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Thiếu Google token" });
    }

    // Verify token với Google
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const full_name = payload.name;
    // Tìm user theo email
    let user = await userRepo.findByEmail(email);
    let isNewUser = false;

    if (!user) {
      // Tạo user mới
      const user_id = await userRepo.getNextUserId();

      user = await userRepo.create({
        user_id,
        full_name,
        email,
        password: null,
        email_verified: true,
        role: "user",
      });

      isNewUser = true;
      console.log(`✅ Tạo user mới từ Google: ${email}`);
    } else {
      console.log(`✅ Login Google cho user hiện tại: ${email}`);
    }

    if (user.account_status && user.account_status !== "active") {
      return res
        .status(403)
        .json({ message: "Tài khoản đã bị khóa hoặc cấm" });
    }

    // LẤY USER MỚI NHẤT TỪ DB ĐỂ ĐẢM BẢO token_version
    const freshUser = await User.findOne({ user_id: user.user_id }).lean();
    
    console.log(`🔓 [GOOGLE] User ${freshUser.user_id} authenticated`);
    console.log(`🔓 [GOOGLE] Fresh token_version from DB: ${freshUser.token_version}`);

    // Tạo JWT token
    const jwtToken = jwt.sign(
      { 
        id: freshUser.user_id, 
        role: freshUser.role,
        token_version: freshUser.token_version || 0
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    console.log(`🔓 [GOOGLE] JWT created with token_version: ${freshUser.token_version || 0}`);


    // Lưu login history
    const ipAddress = req.ip || req.connection.remoteAddress || "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";
    const deviceHash = crypto
      .createHash("md5")
      .update(ipAddress + userAgent)
      .digest("hex");
    try {
      // Check xem device này đã login trước chưa
      const existingLogin = await LoginHistory.findOne({
        user_id: freshUser.user_id,
        device_hash: deviceHash,
      });
      const isNewDevice = !existingLogin;

      await LoginHistory.create({
        user_id: freshUser.user_id,
        email: freshUser.email,
        ip_address: ipAddress,
        device_info: userAgent,
        device_hash: deviceHash,
        login_time: Date.now(),
        is_new_device: isNewDevice,
      });
    } catch (historyErr) {
      console.error("❌ Lỗi lưu login history:", historyErr.message);
    }

    // Login thẳng - user đã active
    return res.json({
      success: true,
      token: jwtToken,
      user: {
        user_id: freshUser.user_id,
        full_name: freshUser.full_name,
        email: freshUser.email,
        role: freshUser.role,
        email_verified: freshUser.email_verified,
        is_first_login: freshUser.is_first_login || false,
      },
    });
  } catch (err) {
    console.error("❌ googleLogin error:", err.message);
    console.error("❌ Error stack:", err.stack);
    console.error("❌ GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
    return res.status(401).json({ 
      message: "Token Google không hợp lệ",
      error: err.message 
    });
  }
}

// 5) Gửi link đặt lại mật khẩu qua email
async function sendPasswordResetLink(req, res) {
  try {
    const email =
      typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    if (!email) {
      return res.status(400).json({ message: "Vui lòng nhập email" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Email không đúng định dạng" });
    }

    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) {
      const token = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      const frontendUrl = process.env.FRONTEND_URL;

      if (!frontendUrl) {
        throw new Error("FRONTEND_URL is required to send password reset links");
      }

      await User.findOneAndUpdate(
        { user_id: existingUser.user_id },
        {
          reset_password_token: tokenHash,
          reset_password_expires_at: expiresAt,
        },
      );

      const resetUrl = new URL("/reset-password", frontendUrl);
      resetUrl.searchParams.set("token", token);

      try {
        await passwordResetEmailService.sendResetLink(email, resetUrl.toString());
      } catch (err) {
        await User.findOneAndUpdate(
          { user_id: existingUser.user_id, reset_password_token: tokenHash },
          { $unset: { reset_password_token: 1, reset_password_expires_at: 1 } },
        );
        throw err;
      }
    }

    return res.json({
      success: true,
      message: "Nếu email đã đăng ký, bạn sẽ nhận được link đặt lại mật khẩu.",
    });
  } catch (err) {
    console.error("sendPasswordResetLink error:", err);
    return res.status(503).json({ message: "Không thể gửi email đặt lại mật khẩu" });
  }
}

// 6) Đặt lại mật khẩu bằng token dùng một lần
async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;

    if (
      typeof token !== "string" ||
      !token ||
      typeof newPassword !== "string" ||
      !newPassword
    ) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const hashed = await bcrypt.hash(newPassword, 10);
    const user = await User.findOneAndUpdate(
      {
        reset_password_token: tokenHash,
        reset_password_expires_at: { $gt: new Date() },
      },
      {
        password: hashed,
        $unset: {
          reset_password_token: 1,
          reset_password_expires_at: 1,
        },
      },
      { new: true },
    );

    if (!user) {
      return res
        .status(400)
        .json({ message: "Link không hợp lệ hoặc đã hết hạn" });
    }

    return res.json({
      success: true,
      message: "Đặt lại mật khẩu thành công",
    });
  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
}

// 7) Logout: Vô hiệu hóa token bằng cách tăng token_version
async function logout(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      console.log(`❌ [LOGOUT] No user ID in request`);
      return res.status(401).json({
        success: false,
        message: "Vui lòng đăng nhập",
      });
    }

    console.log(`\n🔄 [LOGOUT] ========== LOGOUT START ==========`);
    console.log(`🔄 [LOGOUT] User ${userId} requesting logout...`);

    // Lấy user trước khi tăng token_version
    const userBefore = await User.findOne({ user_id: userId }).lean();
    console.log(`🔄 [LOGOUT] User token_version BEFORE logout: ${userBefore?.token_version || 0}`);

    // Tăng token_version để vô hiệu hóa tất cả token cũ
    const userAfter = await User.findOneAndUpdate(
      { user_id: userId },
      { $inc: { token_version: 1 } },
      { new: true }
    ).lean();

    if (!userAfter) {
      console.log(`❌ [LOGOUT] User ${userId} NOT FOUND - FAILED`);
      console.log(`🔄 [LOGOUT] ========== LOGOUT END ==========\n`);
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    console.log(`✅ [LOGOUT] User token_version AFTER logout: ${userAfter.token_version}`);
    console.log(`✅ [LOGOUT] Increment successful: ${userBefore?.token_version || 0} → ${userAfter.token_version}`);
    console.log(`🔄 [LOGOUT] ========== LOGOUT END ==========\n`);
    
    return res.json({
      success: true,
      message: "Đăng xuất thành công",
    });
  } catch (err) {
    console.error(`❌ [LOGOUT] Error:`, err);
    return res.status(500).json({ message: "Lỗi server" });
  }
}

// 7) Xác minh token còn hợp lệ
async function verify(req, res) {
  try {
    // Nếu tới đây, nghĩa là middleware JWT đã xác minh token là hợp lệ
    const user = await User.findOne({ user_id: req.user.id }).lean();
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    return res.json({
      success: true,
      message: "Token hợp lệ",
      user: {
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("verify error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
}

module.exports = {
  register,
  login,
  googleLogin,
  sendPasswordResetLink,
  resetPassword,
  logout,
  verify,
};