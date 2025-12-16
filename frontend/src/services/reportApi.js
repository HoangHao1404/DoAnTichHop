import axios from "axios";

const API_URL = "http://localhost:5001/api/reports";

export const reportApi = {
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
};
