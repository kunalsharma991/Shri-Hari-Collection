import api from "./axiosConfig";

export async function createPaymentIntent(payload) {
  // Placeholder — will be implemented when backend provides payment endpoint
  return api.post("/payments/create", payload);
}
