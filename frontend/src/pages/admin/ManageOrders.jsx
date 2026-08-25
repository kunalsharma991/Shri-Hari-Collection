import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import { fetchAdminOrder, fetchAdminOrders, updateAdminOrderStatus } from "../../services/adminOrderService";
import { getErrorMessage } from "../../services/axiosConfig";
import { formatDate, formatPrice } from "../../utils/format";
import { FaSearch, FaEye } from "react-icons/fa";

const PAGE_SIZE = 10;
const STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminOrders({
        page,
        size: PAGE_SIZE,
        orderStatus: statusFilter || undefined,
        orderNumber: appliedSearch || undefined,
      });
      setOrders(data?.content || []);
      setTotalPages(data?.totalPages || 0);
      setTotalElements(data?.totalElements || 0);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load orders."));
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, appliedSearch]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Debounce the order-number search
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedSearch(search.trim());
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleStatusChange = async (id, orderStatus) => {
    setUpdatingId(id);
    setActionError(null);
    try {
      const updated = await updateAdminOrderStatus(id, orderStatus);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, orderStatus: updated.orderStatus } : o)));
    } catch (err) {
      setActionError(getErrorMessage(err, "Unable to update the order status."));
    } finally {
      setUpdatingId(null);
    }
  };

  const openDetail = async (id) => {
    setDetailLoading(true);
    setActionError(null);
    try {
      setSelectedOrder(await fetchAdminOrder(id));
    } catch (err) {
      setActionError(getErrorMessage(err, "Unable to load the order details."));
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-white mb-6">Manage Orders</h1>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative max-w-md flex-1 min-w-[220px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
          className="bg-gray-900 border border-gray-800 text-gray-300 text-sm rounded-lg px-3 py-2.5 focus:border-yellow-500 focus:outline-none"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
          ))}
        </select>
      </div>

      {actionError && <p className="mb-4 text-sm font-semibold text-red-400">{actionError}</p>}

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="py-16">
            <LoadingSpinner size={2.5} />
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-red-400 mb-3">{error}</p>
            <button onClick={loadOrders} className="text-yellow-400 font-semibold hover:text-yellow-300 transition">
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <p className="py-16 text-center text-gray-500">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500">
                  <th className="text-left px-5 py-3 font-medium">Order No.</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-left px-5 py-3 font-medium">Customer</th>
                  <th className="text-left px-5 py-3 font-medium">Total</th>
                  <th className="text-left px-5 py-3 font-medium">Payment</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                    <td className="px-5 py-3">
                      <button
                        onClick={() => openDetail(order.id)}
                        className="font-semibold text-yellow-400 hover:text-yellow-300 transition flex items-center gap-1"
                      >
                        #{order.orderNumber} <FaEye className="text-xs" />
                      </button>
                    </td>
                    <td className="px-5 py-3 text-gray-400">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-3 text-gray-300">
                      <span className="block">{order.customerName}</span>
                      <span className="block text-xs text-gray-500">{order.customerEmail}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-300 font-semibold">₹{formatPrice(order.totalAmount)}</td>
                    <td className="px-5 py-3 text-gray-400">{order.paymentMethod}</td>
                    <td className="px-5 py-3"><StatusBadge status={order.orderStatus} /></td>
                    <td className="px-5 py-3">
                      <select
                        value={order.orderStatus}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1.5 focus:border-yellow-500 focus:outline-none disabled:opacity-50"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
          <span>{totalElements} orders</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 disabled:opacity-40 hover:border-yellow-500 transition"
            >
              Previous
            </button>
            <span>Page {page + 1} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 disabled:opacity-40 hover:border-yellow-500 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Order Detail Panel */}
      {(selectedOrder || detailLoading) && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6 animate-fade-in">
            {detailLoading || !selectedOrder ? (
              <LoadingSpinner size={2.5} />
            ) : (
              <>
                <h2 className="text-lg font-bold text-white mb-4">Order #{selectedOrder.orderNumber}</h2>
                <div className="space-y-3 text-sm max-h-72 overflow-y-auto">
                  {(selectedOrder.items || []).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-gray-800 rounded-lg p-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-300 font-medium truncate">{item.productName}</p>
                        <p className="text-gray-500 text-xs">Qty: {item.quantity} × ₹{formatPrice(item.unitPrice)}</p>
                      </div>
                      <p className="text-gray-300 font-semibold">₹{formatPrice(item.subtotal)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-800 mt-4 pt-4 flex justify-between text-sm">
                  <span className="text-gray-400">Total</span>
                  <span className="text-yellow-400 font-bold text-lg">₹{formatPrice(selectedOrder.totalAmount)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Delivery: {selectedOrder.shippingAddress}, {selectedOrder.city}, {selectedOrder.state} -{" "}
                  {selectedOrder.pincode}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedOrder.customerName} • {selectedOrder.customerMobile} • {selectedOrder.customerEmail}
                </p>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="mt-4 w-full bg-gray-800 text-gray-300 py-2.5 rounded-lg font-semibold hover:bg-gray-700 transition"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default ManageOrders;
