import axiosClient from "./axiosClient";

export const reportApi = {
  // Dữ liệu cho trang quản lý báo cáo (có lọc + phân trang)
  getManagementReports: async (params = {}) => {
    try {
      const response = await axiosClient.get(`/reports/management`, { params });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu quản lý báo cáo:", error);
      throw error;
    }
  },

  // Lấy tất cả báo cáo
  getAllReports: async () => {
    try {
      const response = await axiosClient.get("/reports");
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy báo cáo:", error);
      throw error;
    }
  },

  // Lấy 1 báo cáo theo ID
  getReportById: async (id) => {
    try {
      const response = await axiosClient.get(`/reports/${id}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết báo cáo:", error);
      throw error;
    }
  },

  // Lấy báo cáo theo userId
  getReportsByUserId: async (userId) => {
    try {
      const response = await axiosClient.get(`/reports/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy báo cáo của user:", error);
      throw error;
    }
  },

  // Tạo báo cáo mới
  createReport: async (reportData) => {
    try {
      const response = await axiosClient.post("/reports", reportData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo báo cáo:", error);
      throw error;
    }
  },
};
