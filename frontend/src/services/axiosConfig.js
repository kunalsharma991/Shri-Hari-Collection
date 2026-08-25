import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request interceptor: attach token when available (placeholder)
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('authToken');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: unify error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Could add global error handling / toast here
    return Promise.reject(err);
  }
);

export default api;
