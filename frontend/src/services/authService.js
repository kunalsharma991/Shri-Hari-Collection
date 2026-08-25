import api, { unwrap } from "./axiosConfig";

export async function login(email, password) {
  return unwrap(await api.post("/auth/login", { email, password }));
}

export async function register({ fullName, email, mobile, password, confirmPassword }) {
  return unwrap(
    await api.post("/auth/register", { fullName, email, mobile, password, confirmPassword })
  );
}

export async function fetchCurrentUser() {
  return unwrap(await api.get("/auth/me"));
}

export async function logout(refreshToken) {
  return unwrap(await api.post("/auth/logout", { refreshToken }));
}
