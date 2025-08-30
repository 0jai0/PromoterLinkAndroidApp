// src/api/config.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: "https://influencerlink-446936445912.asia-south1.run.app", // ✅ your API base URL
  timeout: 10000,                        // request timeout (10s)
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor → attach token if available
API.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token"); // stored after login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor → handle errors globally
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Unauthorized → log out user
      if (error.response.status === 401) {
        await AsyncStorage.removeItem("token");
        // Optionally trigger navigation to login
      }
    }
    return Promise.reject(error);
  }
);

export default API;
