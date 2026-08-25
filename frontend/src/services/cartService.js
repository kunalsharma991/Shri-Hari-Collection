import api, { unwrap } from "./axiosConfig";

export async function fetchCart() {
  return unwrap(await api.get("/cart"));
}

export async function addCartItem(productId, quantity = 1) {
  return unwrap(await api.post("/cart/items", { productId, quantity }));
}

export async function updateCartItem(itemId, quantity) {
  return unwrap(await api.put(`/cart/items/${itemId}`, { quantity }));
}

export async function removeCartItem(itemId) {
  return unwrap(await api.delete(`/cart/items/${itemId}`));
}

export async function clearCart() {
  return unwrap(await api.delete("/cart"));
}
