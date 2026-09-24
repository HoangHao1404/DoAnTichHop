import axiosClient from "./axiosClient";

const userApi = {
  updateProfile(userData) {
    return axiosClient.put("/users/profile", userData);
  },

  changePassword(oldPassword, newPassword) {
    return axiosClient.post("/users/change-password", {
      oldPassword,
      newPassword,
    });
  },

  getUserInfo() {
    return axiosClient.get("/users/profile");
  },

  deleteAccount() {
    return axiosClient.delete("/users/account");
  },

  getManagementUsers(params = {}) {
    return axiosClient.get("/users/management", { params });
  },

  createManagementUser(payload) {
    return axiosClient.post("/users/management", payload);
  },

  updateManagementUser(userId, payload) {
    return axiosClient.put(`/users/management/${userId}`, payload);
  },

  updateManagementUserStatus(userId, status) {
    return axiosClient.patch(`/users/management/${userId}/status`, { status });
  },

  deleteManagementUser(userId) {
    return axiosClient.delete(`/users/management/${userId}`);
  },
};

export default userApi;
