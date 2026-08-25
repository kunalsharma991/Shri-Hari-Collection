import api, { unwrap } from "./axiosConfig";

export async function fetchAdminOrders({
  page = 0,
  size = 12,
  orderStatus,
  orderNumber,
  customerEmail,
} = {}) {
  const params = { page, size };
  if (orderStatus) params.orderStatus = orderStatus;
  if (orderNumber) params.orderNumber = orderNumber;
  if (customerEmail) params.customerEmail = customerEmail;

  return unwrap(await api.get("/admin/orders", { params }));
}

export async function fetchAdminOrder(id) {
  return unwrap(await api.get(`/admin/orders/${id}`));
}

export async function updateAdminOrderStatus(id, orderStatus) {
  return unwrap(await api.patch(`/admin/orders/${id}/status`, { orderStatus }));
}
