const otpStore = new Map();

class OtpService {
  generateOtp(identifier) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 phút
    otpStore.set(identifier, { code, expiresAt });
    return code;
  }

  verifyOtp(identifier, code) {
    const record = otpStore.get(identifier);
    if (!record) return false;

    if (record.expiresAt < Date.now()) {
      otpStore.delete(identifier);
      return false;
    }

    if (record.code !== code) return false;

    otpStore.delete(identifier);
    return true;
  }

  invalidateOtp(identifier) {
    otpStore.delete(identifier);
  }
}

// ⭐ QUAN TRỌNG: export instance, không export class
module.exports = new OtpService();
