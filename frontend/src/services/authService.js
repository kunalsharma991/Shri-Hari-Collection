import api from "./axiosConfig";

export async function login(identifier, password) {
  // Placeholder: send to /auth/login when backend ready
  return api.post("/auth/login", { identifier, password });
}

export async function register(payload) {
  return api.post("/auth/register", payload);
}

export async function me() {
  return api.get("/auth/me");
}
