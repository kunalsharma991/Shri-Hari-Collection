import api from "./axiosConfig";

export async function fetchAdminStats() {
  return api.get("/admin/stats");
}

export async function fetchProductsAdmin() {
  return api.get("/admin/products");
}
