import axiosClient from "./axiosClient";

const authApi = {
  register(payload) {
    // payload: { phone, password, full_name }
    return axiosClient.post("/auth/register", payload);
  },

  login(phone, password) {
    return axiosClient.post("/auth/login", { phone, password });
  },

  googleLogin(googleToken) {
    return axiosClient.post("/auth/google-login", { token: googleToken });
  },

  sendOTP(email) {
    // Gửi OTP để reset password
    return axiosClient.post("/auth/forgot-password/send-otp", { email });
  },

  resetPassword(email, otp, newPassword) {
    // Reset password với OTP
    return axiosClient.post("/auth/forgot-password/reset", { 
      email,
      otp, 
      newPassword 
    });
  },

  logout() {
    // Logout: increment token_version để invalidate tất cả token cũ
    return axiosClient.post("/auth/logout", {});
  },
};

export default authApi;
