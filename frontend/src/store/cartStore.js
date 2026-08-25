import { create } from "zustand";

const useCartStore = create((set, get) => ({
  cart: [],

  // Add product to cart; if already exists, increase quantity instead of duplicate
  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + (product.quantity || 1) }
              : item
          ),
        };
      }
      return {
        cart: [...state.cart, { ...product, quantity: product.quantity || 1 }],
      };
    }),

  // Increase quantity of an item by 1
  increaseQuantity: (id) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      ),
    })),

  // Decrease quantity by 1; never goes below 1
  decreaseQuantity: (id) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ),
    })),

  // Remove item completely from cart
  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),

  // Clear entire cart after order is placed
  clearCart: () => set({ cart: [] }),

  // Get total item count (sum of quantities)
  getTotalQuantity: () => {
    const state = get();
    return state.cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  // Get grand total price
  getTotalPrice: () => {
    const state = get();
    return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
}));

export default useCartStore;
