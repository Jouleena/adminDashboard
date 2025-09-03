
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://sawwah-backend.onrender.com", 
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
   // const refreshToken = localStorage.getItem("refreshToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;