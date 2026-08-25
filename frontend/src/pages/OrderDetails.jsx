import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import { cancelOrder, fetchOrder } from "../services/orderService";
import { getErrorMessage } from "../services/axiosConfig";
import { formatDate, formatPrice } from "../utils/format";
import { FaArrowLeft, FaBoxOpen, FaMapMarkerAlt } from "react-icons/fa";

const CANCELLABLE = ["PENDING", "CONFIRMED"];

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  const loadOrder = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setOrder(await fetchOrder(id));
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load this order."));
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleCancel = async () => {
    setCancelling(true);
    setCancelError(null);
    try {
      setOrder(await cancelOrder(id));
    } catch (err) {
      setCancelError(getErrorMessage(err, "Unable to cancel this order."));
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <Navbar />
      <PageHeader
        title="Order Details"
        subtitle={order ? `Order #${order.orderNumber}` : "Loading your order"}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "My Orders", to: "/my-orders" }, { label: "Details" }]}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <Link
            to="/my-orders"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition mb-6 text-sm"
          >
            <FaArrowLeft className="text-xs" />
            Back to My Orders
          </Link>

          {loading ? (
            <div className="py-20">
              <LoadingSpinner size={3} />
            </div>
          ) : error || !order ? (
            <div className="text-center py-20">
              <p className="text-lg text-red-600 mb-4">{error || "Order not found."}</p>
              <button onClick={loadOrder} className="text-yellow-600 font-semibold hover:text-yellow-700 transition">
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                  <h2 className="text-2xl font-bold text-gray-900">#{order.orderNumber}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"} • Payment{" "}
                    {String(order.paymentStatus || "").toLowerCase()}
                  </p>
                </div>
                <StatusBadge status={order.orderStatus} />
              </div>

              {/* Items */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaBoxOpen className="text-yellow-500" />
                  Items
                </h3>
                <div className="space-y-3">
                  {(order.items || []).map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 bg-gray-50 rounded-xl p-4">
                      <div className="min-w-0">
                        <Link to={`/product/${item.productId}`} className="font-semibold text-gray-900 hover:text-yellow-600 transition">
                          {item.productName}
                        </Link>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} × ₹{formatPrice(item.unitPrice)}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900">₹{formatPrice(item.subtotal)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 mt-5 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">₹{formatPrice(order.subtotal)}</span>
                  </div>
                  {Number(order.discountAmount) > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Discount</span>
                      <span className="font-semibold text-green-600">-₹{formatPrice(order.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">
                      {Number(order.shippingAmount) === 0 ? "FREE" : `₹${formatPrice(order.shippingAmount)}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-xl font-extrabold text-yellow-600">₹{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-yellow-500" />
                  Delivery Address
                </h3>
                <div className="text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-900">{order.customerName}</p>
                  <p>{order.shippingAddress}</p>
                  <p>{order.city}, {order.state} - {order.pincode}</p>
                  <p className="mt-2"><span className="text-gray-500">Phone:</span> {order.customerMobile}</p>
                  <p><span className="text-gray-500">Email:</span> {order.customerEmail}</p>
                </div>
              </div>

              {/* Cancel */}
              {CANCELLABLE.includes(order.orderStatus) && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  {cancelError && <p className="text-sm text-red-600 mb-3 font-semibold">{cancelError}</p>}
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="w-full sm:w-auto border-2 border-red-200 text-red-600 px-6 py-3 rounded-full font-semibold hover:bg-red-50 transition disabled:opacity-50"
                  >
                    {cancelling ? "Cancelling..." : "Cancel Order"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default OrderDetails;
