import api from "./axiosConfig";

export async function syncCart(cartItems) {
  // Placeholder to sync cart with backend (if needed)
  return api.post("/cart/sync", { items: cartItems });
}
