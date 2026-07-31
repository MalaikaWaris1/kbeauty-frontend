import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

// Request Interceptor: Route aur Token type identify send right token
API.interceptors.request.use(
  (config) => {
    const isAdminRoute = config.url?.includes("/admin");
    
    if (isAdminRoute) {
      const adminToken = localStorage.getItem("adminAccessToken");
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    } else {
      // for Customer Route 
      const userToken = localStorage.getItem("userAccessToken") || localStorage.getItem("accessToken");
      if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;