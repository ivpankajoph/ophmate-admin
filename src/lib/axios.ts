import axios, { AxiosInstance } from "axios";
import { store } from "../store"; // to get token from auth state

// 🌐 Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000/api", // ✅ Your backend base URL
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // optional
});

// 🧠 Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚦 Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can also dispatch logout or show toast notifications here
    if (error.response?.status === 401) {
      console.warn("Unauthorized — maybe token expired");
    }
    return Promise.reject(error);
  }
);

export default api;
