// Mirrors the backend order.shipping-charge / order.free-shipping-threshold settings
export const SHIPPING_CHARGE = 50;
export const FREE_SHIPPING_THRESHOLD = 999;

export function shippingFor(subtotal) {
  return Number(subtotal || 0) >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
}

// Effective selling price: discountPrice when present, otherwise price
export function effectivePrice(product) {
  const price = Number(product?.price || 0);
  const discount = product?.discountPrice != null ? Number(product.discountPrice) : null;
  return discount != null && discount > 0 && discount < price ? discount : price;
}

export function discountPercent(product) {
  const price = Number(product?.price || 0);
  const effective = effectivePrice(product);
  if (!price || effective >= price) return 0;
  return Math.round(((price - effective) / price) * 100);
}

export function formatPrice(value) {
  return Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatStatus(status) {
  if (!status) return "";
  const text = String(status).toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}
