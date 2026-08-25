import api from "./axiosConfig";

export async function fetchWishlist() {
  return api.get("/wishlist");
}

export async function addToWishlist(item) {
  return api.post("/wishlist", item);
}

export async function removeFromWishlist(id) {
  return api.delete(`/wishlist/${id}`);
}
