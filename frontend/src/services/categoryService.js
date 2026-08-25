import api, { unwrap } from "./axiosConfig";

export async function fetchCategories() {
  return unwrap(await api.get("/categories"));
}

export async function fetchCategoryBySlug(slug) {
  return unwrap(await api.get(`/categories/slug/${slug}`));
}
