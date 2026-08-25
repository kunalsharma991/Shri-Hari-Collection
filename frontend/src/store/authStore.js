import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  role: null, // "user" | "admin"

  // Login with email/mobile + password
  login: (identifier, password, rememberMe = false) => {
    // Mock authentication logic
    const users = JSON.parse(localStorage.getItem("shc_users") || "null") || [
      {
        id: 1,
        fullName: "Admin User",
        email: "admin@shrihari.com",
        mobile: "8859000084",
        password: "admin123",
        role: "admin",
      },
      {
        id: 2,
        fullName: "Demo Customer",
        email: "demo@example.com",
        mobile: "9999999999",
        password: "demo123",
        role: "user",
      },
    ];

    const found = users.find(
      (u) =>
        (u.email === identifier || u.mobile === identifier) &&
        u.password === password
    );

    if (found) {
      const userObj = {
        id: found.id,
        fullName: found.fullName,
        email: found.email,
        mobile: found.mobile,
        role: found.role,
      };

      if (rememberMe) {
        localStorage.setItem("shc_auth", JSON.stringify(userObj));
      } else {
        sessionStorage.setItem("shc_auth", JSON.stringify(userObj));
      }

      set({ user: userObj, isAuthenticated: true, role: found.role });
      return { success: true };
    }
    return { success: false, message: "Invalid credentials. Please try again." };
  },

  // Register new user
  register: (userData) => {
    const users = JSON.parse(localStorage.getItem("shc_users") || "null") || [
      {
        id: 1,
        fullName: "Admin User",
        email: "admin@shrihari.com",
        mobile: "8859000084",
        password: "admin123",
        role: "admin",
      },
      {
        id: 2,
        fullName: "Demo Customer",
        email: "demo@example.com",
        mobile: "9999999999",
        password: "demo123",
        role: "user",
      },
    ];

    // Check if email or mobile already exists
    const exists = users.find(
      (u) => u.email === userData.email || u.mobile === userData.mobile
    );
    if (exists) {
      return { success: false, message: "Email or mobile number already registered." };
    }

    const newUser = {
      id: Date.now(),
      fullName: userData.fullName,
      email: userData.email,
      mobile: userData.mobile,
      password: userData.password,
      role: "user",
    };

    users.push(newUser);
    localStorage.setItem("shc_users", JSON.stringify(users));

    // Auto-login after registration
    const userObj = {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      mobile: newUser.mobile,
      role: "user",
    };
    sessionStorage.setItem("shc_auth", JSON.stringify(userObj));
    set({ user: userObj, isAuthenticated: true, role: "user" });

    return { success: true };
  },

  // Logout
  logout: () => {
    localStorage.removeItem("shc_auth");
    sessionStorage.removeItem("shc_auth");
    set({ user: null, isAuthenticated: false, role: null });
  },

  // Update user profile
  updateProfile: (updates) => {
    const { user } = get();
    if (!user) return;
    const updatedUser = { ...user, ...updates };

    // Update in storage
    const users = JSON.parse(localStorage.getItem("shc_users") || "[]");
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      localStorage.setItem("shc_users", JSON.stringify(users));
    }

    localStorage.setItem("shc_auth", JSON.stringify(updatedUser));
    sessionStorage.setItem("shc_auth", JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  // Change password
  changePassword: (oldPassword, newPassword) => {
    const { user } = get();
    if (!user) return { success: false, message: "Not logged in." };

    const users = JSON.parse(localStorage.getItem("shc_users") || "[]");
    const found = users.find((u) => u.id === user.id);
    if (!found || found.password !== oldPassword) {
      return { success: false, message: "Current password is incorrect." };
    }

    found.password = newPassword;
    localStorage.setItem("shc_users", JSON.stringify(users));
    return { success: true };
  },

  // Forgot password (mock)
  forgotPassword: (email) => {
    const users = JSON.parse(localStorage.getItem("shc_users") || "[]");
    const found = users.find((u) => u.email === email);
    if (!found) return { success: false, message: "Email not found." };
    return { success: true, message: "Password reset link sent to your email." };
  },

  // Reset password
  resetPassword: (email, newPassword) => {
    const users = JSON.parse(localStorage.getItem("shc_users") || "[]");
    const idx = users.findIndex((u) => u.email === email);
    if (idx === -1) return { success: false, message: "Email not found." };
    users[idx].password = newPassword;
    localStorage.setItem("shc_users", JSON.stringify(users));
    return { success: true };
  },

  // Restore session on app load
  restoreSession: () => {
    const saved =
      localStorage.getItem("shc_auth") || sessionStorage.getItem("shc_auth");
    if (saved) {
      const user = JSON.parse(saved);
      set({ user, isAuthenticated: true, role: user.role });
    }
  },

  // Check if admin
  isAdmin: () => get().role === "admin",
}));

export default useAuthStore;
