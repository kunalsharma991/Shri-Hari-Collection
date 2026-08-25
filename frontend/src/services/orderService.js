import api, { unwrap } from "./axiosConfig";

export async function placeOrder({ shippingAddress, city, state, pincode, paymentMethod }) {
  return unwrap(
    await api.post("/orders", { shippingAddress, city, state, pincode, paymentMethod })
  );
}

export async function fetchOrders({ page = 0, size = 12 } = {}) {
  return unwrap(await api.get("/orders", { params: { page, size } }));
}

export async function fetchOrder(id) {
  return unwrap(await api.get(`/orders/${id}`));
}

export async function cancelOrder(id) {
  return unwrap(await api.patch(`/orders/${id}/cancel`));
}
