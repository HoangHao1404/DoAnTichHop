import axiosClient from "./axiosClient";

const userApi = {
  updateProfile(userData) {
    return axiosClient.put("/user/profile", userData);
  },

  changePassword(oldPassword, newPassword) {
    return axiosClient.post("/user/change-password", {
      oldPassword,
      newPassword,
    });
  },

  getUserInfo() {
    return axiosClient.get("/user/profile");
  },

  deleteAccount() {
    return axiosClient.delete("/user/account");
  },
};

export default userApi;
