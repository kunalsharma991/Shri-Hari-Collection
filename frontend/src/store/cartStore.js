import { create } from "zustand";
import * as cartService from "../services/cartService";
import { getErrorMessage } from "../services/axiosConfig";
import { getAccessToken } from "../services/tokenStorage";

// Server-backed cart: every mutation returns the full cart from the backend.
const useCartStore = create((set, get) => ({
  items: [],
  cartTotal: 0,
  totalItemCount: 0,
  loading: false,
  updatingItemId: null,
  error: null,

  applyCart: (cart) =>
    set({
      items: cart?.items || [],
      cartTotal: Number(cart?.cartTotal || 0),
      totalItemCount: cart?.totalItemCount || 0,
    }),

  fetchCart: async () => {
    if (!getAccessToken()) {
      set({ items: [], cartTotal: 0, totalItemCount: 0, error: null });
      return;
    }
    set({ loading: true, error: null });
    try {
      get().applyCart(await cartService.fetchCart());
      set({ loading: false });
    } catch (error) {
      set({ loading: false, error: getErrorMessage(error, "Unable to load your cart.") });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    if (!getAccessToken()) {
      return { success: false, requiresAuth: true, message: "Please log in to add items to your cart." };
    }
    try {
      get().applyCart(await cartService.addCartItem(productId, quantity));
      return { success: true };
    } catch (error) {
      const message = getErrorMessage(error, "Unable to add this item to your cart.");
      set({ error: message });
      return { success: false, message };
    }
  },

  updateQuantity: async (itemId, quantity) => {
    if (quantity < 1) return { success: false, message: "Quantity must be at least 1." };
    set({ updatingItemId: itemId, error: null });
    try {
      get().applyCart(await cartService.updateCartItem(itemId, quantity));
      set({ updatingItemId: null });
      return { success: true };
    } catch (error) {
      const message = getErrorMessage(error, "Unable to update the quantity.");
      set({ updatingItemId: null, error: message });
      return { success: false, message };
    }
  },

  removeItem: async (itemId) => {
    set({ updatingItemId: itemId, error: null });
    try {
      await cartService.removeCartItem(itemId);
      set({ updatingItemId: null });
      await get().fetchCart();
      return { success: true };
    } catch (error) {
      const message = getErrorMessage(error, "Unable to remove this item.");
      set({ updatingItemId: null, error: message });
      return { success: false, message };
    }
  },

  clearCart: async () => {
    try {
      await cartService.clearCart();
    } catch {
      // Ignore: the cart is also cleared server-side when an order is placed.
    }
    set({ items: [], cartTotal: 0, totalItemCount: 0 });
  },

  // Local reset used on logout, without touching the server cart
  reset: () => set({ items: [], cartTotal: 0, totalItemCount: 0, error: null }),
}));

export default useCartStore;
