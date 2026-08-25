import api from "./axiosConfig";

export async function fetchProducts(params) {
  // params: { search, category, priceMin, priceMax, sort }
  return api.get("/products", { params });
}

export async function fetchProduct(id) {
  return api.get(`/products/${id}`);
}
