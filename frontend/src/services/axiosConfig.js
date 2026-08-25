import axios from "axios";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "./tokenStorage";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise = null;

// Refresh the access token once for concurrent 401s, then replay the requests.
function refreshAccessToken() {
  if (!refreshPromise) {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return Promise.reject(new Error("No refresh token"));

    refreshPromise = axios
      .post(`${API_BASE}/auth/refresh`, { refreshToken })
      .then(({ data }) => {
        saveTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
        return data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const isAuthCall = original?.url?.includes("/auth/");

    if (status === 401 && original && !original._retry && !isAuthCall && getRefreshToken()) {
      original._retry = true;
      try {
        const token = await refreshAccessToken();
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        clearSession();
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

// Backend wraps most payloads in { success, message, data }; auth endpoints return raw bodies.
export function unwrap(response) {
  const body = response.data;
  if (body && typeof body === "object" && "success" in body && "data" in body) {
    return body.data;
  }
  return body;
}

export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

export default api;
