import { create } from "zustand";
import * as authService from "../services/authService";
import { getErrorMessage } from "../services/axiosConfig";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  saveSession,
  saveUser,
} from "../services/tokenStorage";

// Backend roles are enum values ("USER" / "ADMIN"); the UI works with lowercase.
function normalizeRole(role) {
  return role ? String(role).toLowerCase() : null;
}

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  role: null, // "user" | "admin"
  loading: false,

  // Login with email + password against the backend
  login: async (email, password, rememberMe = false) => {
    set({ loading: true });
    try {
      const data = await authService.login(email, password);
      const user = { ...data.user, role: normalizeRole(data.user?.role) };
      saveSession(
        { accessToken: data.accessToken, refreshToken: data.refreshToken, user },
        rememberMe
      );
      set({ user, isAuthenticated: true, role: user.role, loading: false });
      return { success: true, user };
    } catch (error) {
      set({ loading: false });
      const status = error?.response?.status;
      return {
        success: false,
        message:
          status === 401 || status === 403
            ? "Invalid credentials. Please try again."
            : getErrorMessage(error),
      };
    }
  },

  // Register a new user, then log them in so the session has a JWT
  register: async (userData) => {
    set({ loading: true });
    try {
      await authService.register({
        fullName: userData.fullName,
        email: userData.email,
        mobile: userData.mobile,
        password: userData.password,
        confirmPassword: userData.confirmPassword ?? userData.password,
      });
      set({ loading: false });
      return await get().login(userData.email, userData.password, false);
    } catch (error) {
      set({ loading: false });
      return { success: false, message: getErrorMessage(error, "Registration failed.") };
    }
  },

  logout: async () => {
    const refreshToken = getRefreshToken();
    clearSession();
    set({ user: null, isAuthenticated: false, role: null });
    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch {
        // Session is already cleared locally; ignore revoke failures.
      }
    }
  },

  // Local-only profile edit: the backend has no profile update endpoint yet
  updateProfile: (updates) => {
    const { user } = get();
    if (!user) return { success: false, message: "Not logged in." };
    const updatedUser = { ...user, ...updates };
    saveUser(updatedUser);
    set({ user: updatedUser });
    return {
      success: true,
      message: "Profile updated locally. Server-side profile update is not available yet.",
    };
  },

  changePassword: () => ({
    success: false,
    message: "Password change is not supported by the backend yet.",
  }),

  forgotPassword: () => ({
    success: false,
    message: "Password reset is not supported by the backend yet.",
  }),

  resetPassword: () => ({
    success: false,
    message: "Password reset is not supported by the backend yet.",
  }),

  // Restore session from storage on app load and revalidate against /auth/me
  restoreSession: async () => {
    if (!getAccessToken()) return;
    const stored = getStoredUser();
    if (stored) {
      set({ user: stored, isAuthenticated: true, role: normalizeRole(stored.role) });
    }
    try {
      const fresh = await authService.fetchCurrentUser();
      const user = { ...fresh, role: normalizeRole(fresh.role) };
      saveUser(user);
      set({ user, isAuthenticated: true, role: user.role });
    } catch {
      clearSession();
      set({ user: null, isAuthenticated: false, role: null });
    }
  },

  isAdmin: () => get().role === "admin",
}));

export default useAuthStore;
