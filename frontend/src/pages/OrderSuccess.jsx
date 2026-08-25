import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchOrder } from "../services/orderService";
import { formatDate, formatPrice } from "../utils/format";
import { FaCheckCircle, FaShoppingBag, FaBoxOpen, FaMapMarkerAlt, FaCalendarAlt, FaCopy } from "react-icons/fa";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Fall back to the last order id when the page is reloaded
  useEffect(() => {
    if (order) return;
    const lastOrderId = sessionStorage.getItem("lastOrderId");
    if (!lastOrderId) {
      navigate("/");
      return;
    }
    fetchOrder(lastOrderId)
      .then(setOrder)
      .catch(() => setError("We could not load your order. Check My Orders for the latest status."));
  }, [order, navigate]);

  const copyOrderNumber = () => {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
          <div>
            <p className="text-lg text-red-600 mb-4">{error}</p>
            <Link to="/my-orders" className="bg-black text-yellow-400 px-6 py-3 rounded-full font-semibold hover:bg-gray-900 transition">
              Go to My Orders
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </>
    );
  }

  const totalQuantity = (order.items || []).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

          {/* ─── Success Header ─── */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-5 animate-bounce">
              <FaCheckCircle className="text-5xl text-green-500" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">
              Order <span className="text-yellow-500">Confirmed!</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Thank you for shopping with Shri Hari Collection. Your order has been placed successfully.
            </p>
          </div>

          {/* ─── Order Number Card ─── */}
          <div className="bg-black rounded-2xl p-6 sm:p-8 text-center mb-8 shadow-xl">
            <p className="text-yellow-400 text-sm font-semibold uppercase tracking-widest mb-2">Order Number</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-white text-2xl sm:text-3xl font-bold tracking-wider">#{order.orderNumber}</p>
              <button
                onClick={copyOrderNumber}
                className="text-yellow-400 hover:text-yellow-300 transition p-2 rounded-lg hover:bg-gray-800"
                title="Copy Order Number"
              >
                <FaCopy />
              </button>
            </div>
            {copied && (
              <p className="text-green-400 text-xs mt-2 animate-pulse">Copied to clipboard!</p>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-5 text-gray-400 text-sm">
              <span className="flex items-center gap-1.5">
                <FaCalendarAlt className="text-yellow-500" />
                {formatDate(order.createdAt)}
              </span>
              <span className="hidden sm:inline text-gray-700">|</span>
              <span className="flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-yellow-500" />
                {order.city}, {order.state}
              </span>
            </div>
          </div>

          {/* ─── Order Items ─── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <FaBoxOpen className="text-yellow-500" />
              Order Items
            </h2>

            <div className="space-y-4">
              {(order.items || []).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                >
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{item.productName}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{formatPrice(item.unitPrice)}</p>
                  </div>

                  {/* Subtotal */}
                  <p className="font-bold text-gray-900 flex-shrink-0">
                    ₹{formatPrice(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-5"></div>

            {/* Order Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalQuantity} items)</span>
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
              <div className="border-t border-gray-200 my-3"></div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-extrabold text-yellow-600">
                  ₹{formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* ─── Delivery Info ─── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <FaMapMarkerAlt className="text-yellow-500" />
              Delivery Address
            </h2>
            <div className="text-gray-600 space-y-1">
              <p className="font-semibold text-gray-900 text-lg">{order.customerName}</p>
              <p>{order.shippingAddress}</p>
              <p>{order.city}, {order.state} - {order.pincode}</p>
              <p className="mt-2">
                <span className="text-gray-500">Phone:</span> {order.customerMobile}
              </p>
              <p>
                <span className="text-gray-500">Email:</span> {order.customerEmail}
              </p>
              <p className="mt-2">
                <span className="text-gray-500">Payment:</span>{" "}
                <span className="font-semibold">
                  {order.paymentMethod === "COD" ? "Cash On Delivery" : "Online Payment"}
                </span>
              </p>
            </div>
          </div>

          {/* ─── Action Buttons ─── */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              className="flex-1 flex items-center justify-center gap-2 bg-black text-yellow-400 py-4 rounded-full font-bold text-lg hover:bg-gray-900 hover:scale-[1.02] active:scale-100 transition-all duration-300 shadow-lg"
            >
              <FaShoppingBag />
              Continue Shopping
            </Link>
            <Link
              to={`/orders/${order.id}`}
              className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 py-4 rounded-full font-bold text-lg hover:border-black hover:text-black transition-all duration-300"
            >
              View Order Details
            </Link>
          </div>

          {/* ─── Help Section ─── */}
          <div className="text-center mt-10 p-6 bg-gray-50 rounded-2xl">
            <p className="text-gray-500 text-sm">
              Need help with your order? Contact us at{" "}
              <a href="tel:8859000084" className="text-yellow-600 font-semibold hover:underline">
                8859000084
              </a>{" "}
              or visit{" "}
              <Link to="/contact" className="text-yellow-600 font-semibold hover:underline">
                Contact Us
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default OrderSuccess;
