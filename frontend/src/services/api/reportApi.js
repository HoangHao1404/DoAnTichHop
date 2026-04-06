import axios from "axios";

const API_URL = `${
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5050/api"
}/reports`;

export const reportApi = {
  // Dữ liệu cho trang quản lý báo cáo (có lọc + phân trang)
  getManagementReports: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/management`, { params });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu quản lý báo cáo:", error);
      throw error;
    }
  },

  // Lấy tất cả báo cáo
  getAllReports: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy báo cáo:", error);
      throw error;
    }
  },

  // Lấy 1 báo cáo theo ID
  getReportById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết báo cáo:", error);
      throw error;
    }
  },

  // Lấy báo cáo theo userId
  getReportsByUserId: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy báo cáo của user:", error);
      throw error;
    }
  },

  // Tạo báo cáo mới
  createReport: async (reportData) => {
    try {
      const response = await axios.post(API_URL, reportData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo báo cáo:", error);
      throw error;
    }
  },
};
