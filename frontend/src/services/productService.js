import api, { unwrap } from "./axiosConfig";

export async function fetchProducts({
  search,
  category,
  minPrice,
  maxPrice,
  sort,
  page = 0,
  size = 12,
} = {}) {
  const params = { page, size };
  if (search) params.search = search;
  if (category) params.category = category;
  if (minPrice != null) params.minPrice = minPrice;
  if (maxPrice != null) params.maxPrice = maxPrice;
  if (sort) params.sort = sort;

  return unwrap(await api.get("/products", { params }));
}

export async function fetchProduct(id) {
  return unwrap(await api.get(`/products/${id}`));
}

export async function fetchProductBySlug(slug) {
  return unwrap(await api.get(`/products/slug/${slug}`));
}

export async function fetchFeaturedProducts() {
  return unwrap(await api.get("/products/featured"));
}
