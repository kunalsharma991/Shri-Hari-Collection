import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchOrders } from "../services/orderService";
import { getErrorMessage } from "../services/axiosConfig";
import { formatDate, formatPrice } from "../utils/format";
import { FaBox, FaCalendarAlt, FaMoneyBillWave, FaChevronRight } from "react-icons/fa";

const PAGE_SIZE = 10;

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrders({ page, size: PAGE_SIZE });
      setOrders(data?.content || []);
      setTotalPages(data?.totalPages || 0);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load your orders."));
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <>
      <Navbar />
      <PageHeader
        title="My Orders"
        subtitle="Track and manage your orders"
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "My Orders" }]}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          {loading ? (
            <div className="py-20">
              <LoadingSpinner size={3} />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-lg text-red-600 mb-4">{error}</p>
              <button onClick={loadOrders} className="text-yellow-600 font-semibold hover:text-yellow-700 transition">
                Try Again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <EmptyState
              icon={FaBox}
              title="No Orders Yet"
              description="You haven't placed any orders. Start shopping to see your orders here!"
              actionLabel="Shop Now"
              actionLink="/products"
            />
          ) : (
            <>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Order Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-gray-50 border-b border-gray-100">
                      <div className="flex items-center gap-4 flex-wrap text-sm text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <FaBox className="text-yellow-500 text-xs" />
                          <span className="font-semibold text-gray-900">#{order.orderNumber}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FaCalendarAlt className="text-gray-400 text-xs" />
                          {formatDate(order.createdAt)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FaMoneyBillWave className="text-gray-400 text-xs" />
                          ₹{formatPrice(order.totalAmount)}
                        </span>
                      </div>
                      <StatusBadge status={order.orderStatus} />
                    </div>

                    {/* Order Footer */}
                    <div className="flex items-center justify-between px-6 py-4">
                      <p className="text-sm text-gray-500">
                        {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"} • Payment{" "}
                        {String(order.paymentStatus || "").toLowerCase()}
                      </p>
                      <Link
                        to={`/orders/${order.id}`}
                        className="flex items-center gap-1 text-sm text-yellow-600 font-semibold hover:text-yellow-700 transition"
                      >
                        View Details <FaChevronRight className="text-xs" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-700 disabled:opacity-40 hover:border-yellow-500 transition"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-500">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-700 disabled:opacity-40 hover:border-yellow-500 transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MyOrders;
