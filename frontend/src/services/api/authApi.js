import axiosClient from "./axiosClient";

const authApi = {
  sendRegisterOtp(phone) {
    return axiosClient.post("/auth/register/send-otp", { phone });
  },

  confirmRegister(payload) {
    // payload: { phone, otp, password, full_name }
    return axiosClient.post("/auth/register/confirm", payload);
  },

  login(phone, password) {
    return axiosClient.post("/auth/login", { phone, password });
  },
};

export default authApi;
