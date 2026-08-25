import api from "./axiosConfig";

export async function placeOrder(orderPayload) {
  return api.post("/orders", orderPayload);
}

export async function fetchOrders() {
  return api.get("/orders");
}
