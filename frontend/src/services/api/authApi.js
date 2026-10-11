import axiosClient from "./axiosClient";

const authApi = {
  register(payload) {
    // payload: { email, password, full_name }
    return axiosClient.post("/auth/register", payload);
  },

  login(email, password) {
    return axiosClient.post("/auth/login", { email, password });
  },

  googleLogin(googleToken) {
    return axiosClient.post("/auth/google-login", { token: googleToken });
  },

  sendPasswordResetLink(email) {
    return axiosClient.post("/auth/forgot-password/send-link", { email });
  },

  resetPassword(token, newPassword) {
    return axiosClient.post("/auth/forgot-password/reset", { token, newPassword });
  },

  logout() {
    // Logout: increment token_version để invalidate tất cả token cũ
    return axiosClient.post("/auth/logout", {});
  },
};

export default authApi;
