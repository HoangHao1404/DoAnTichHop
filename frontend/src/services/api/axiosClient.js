import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5001/api", // backend của bạn
  withCredentials: false,
});

// Optional: attach token nếu có
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
