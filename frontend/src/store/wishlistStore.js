import { create } from "zustand";

const useWishlistStore = create((set, get) => ({
  wishlist: [],

  // Add item to wishlist
  addItem: (product) =>
    set((state) => {
      if (state.wishlist.find((item) => item.id === product.id)) return state;
      return { wishlist: [...state.wishlist, product] };
    }),

  // Remove item from wishlist
  removeItem: (id) =>
    set((state) => ({
      wishlist: state.wishlist.filter((item) => item.id !== id),
    })),

  // Toggle item in wishlist (add if not present, remove if present)
  toggleItem: (product) =>
    set((state) => {
      const exists = state.wishlist.find((item) => item.id === product.id);
      if (exists) {
        return { wishlist: state.wishlist.filter((item) => item.id !== product.id) };
      }
      return { wishlist: [...state.wishlist, product] };
    }),

  // Check if item is in wishlist
  isInWishlist: (id) => {
    return get().wishlist.some((item) => item.id === id);
  },

  // Get wishlist count
  getCount: () => get().wishlist.length,
}));

export default useWishlistStore;
