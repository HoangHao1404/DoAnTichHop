import axiosClient from "./axiosClient";

export const reportApi = {
  // Dá»¯ liá»‡u cho trang quáº£n lÃ½ bÃ¡o cÃ¡o (cÃ³ lá»c + phÃ¢n trang)
  getManagementReports: async (params = {}) => {
    try {
      const response = await axiosClient.get(`/reports/management`, { params });
      return response.data;
    } catch (error) {
      console.error("Lá»—i khi láº¥y dá»¯ liá»‡u quáº£n lÃ½ bÃ¡o cÃ¡o:", error);
      throw error;
    }
  },

  // Dá»¯ liá»‡u cho trang Ä‘Æ¡n tiáº¿p nháº­n (cÃ³ lá»c + phÃ¢n trang)
  getReceptionReports: async (params = {}) => {
    try {
      const response = await axiosClient.get(`/reports/reception`, { params });
      return response.data;
    } catch (error) {
      console.error("Lá»—i khi láº¥y dá»¯ liá»‡u Ä‘Æ¡n tiáº¿p nháº­n:", error);
      throw error;
    }
  },

  // Láº¥y táº¥t cáº£ bÃ¡o cÃ¡o
  getAllReports: async () => {
    try {
      const response = await axiosClient.get("/reports");
      return response.data;
    } catch (error) {
      console.error("Lá»—i khi láº¥y bÃ¡o cÃ¡o:", error);
      throw error;
    }
  },

  // Láº¥y 1 bÃ¡o cÃ¡o theo ID
  getReportById: async (id) => {
    try {
      const response = await axiosClient.get(`/reports/${id}`);
      return response.data;
    } catch (error) {
      console.error("Lá»—i khi láº¥y chi tiáº¿t bÃ¡o cÃ¡o:", error);
      throw error;
    }
  },

  // Láº¥y bÃ¡o cÃ¡o theo userId
  getReportsByUserId: async (userId) => {
    try {
      const response = await axiosClient.get(`/reports/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Lá»—i khi láº¥y bÃ¡o cÃ¡o cá»§a user:", error);
      throw error;
    }
  },

  // Alias cho test workflow (dÃ¹ng cÃ¹ng endpoint hiá»‡n táº¡i)
  getTestReportsByUserId: async (userId) => {
    try {
      const response = await axiosClient.get(`/reports/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Lá»—i khi láº¥y bÃ¡o cÃ¡o test cá»§a user:", error);
      throw error;
    }
  },

  // Táº¡o bÃ¡o cÃ¡o má»›i
  createReport: async (reportData) => {
    try {
      const response = await axiosClient.post("/reports", reportData);
      return response.data;
    } catch (error) {
      console.error("Lá»—i khi táº¡o bÃ¡o cÃ¡o:", error);
      throw error;
    }
  },

  updateReportStatus: async (reportId, status) => {
    try {
      const response = await axiosClient.patch(`/reports/${reportId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error("Lá»—i khi cáº­p nháº­t tráº¡ng thÃ¡i bÃ¡o cÃ¡o:", error);
      throw error;
    }
  },
};
