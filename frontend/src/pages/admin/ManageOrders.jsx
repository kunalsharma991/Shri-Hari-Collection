import { useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import StatusBadge from "../../components/StatusBadge";
import orders from "../../data/orders";
import { FaSearch, FaEye } from "react-icons/fa";

function ManageOrders() {
  const [orderList, setOrderList] = useState(orders);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = orderList.filter((o) => o.id.toLowerCase().includes(search.toLowerCase()));

  const updateStatus = (id, status) => {
    setOrderList(orderList.map((o) => o.id === id ? { ...o, status } : o));
  };

  const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-white mb-6">Manage Orders</h1>

      <div className="relative mb-4 max-w-md">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by order ID..." className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none text-sm" />
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500">
                <th className="text-left px-5 py-3 font-medium">Order ID</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-5 py-3 font-medium">Items</th>
                <th className="text-left px-5 py-3 font-medium">Total</th>
                <th className="text-left px-5 py-3 font-medium">Payment</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Update</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                  <td className="px-5 py-3">
                    <button onClick={() => setSelectedOrder(order)} className="font-semibold text-yellow-400 hover:text-yellow-300 transition flex items-center gap-1">
                      #{order.id} <FaEye className="text-xs" />
                    </button>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="px-5 py-3 text-gray-300">{order.items.length} items</td>
                  <td className="px-5 py-3 text-gray-300 font-semibold">₹{order.total.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3 text-gray-400 capitalize">{order.paymentMethod === "cod" ? "COD" : "Online"}</td>
                  <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-5 py-3">
                    <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1.5 focus:border-yellow-500 focus:outline-none">
                      {statuses.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Panel */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6 animate-fade-in">
            <h2 className="text-lg font-bold text-white mb-4">Order #{selectedOrder.id}</h2>
            <div className="space-y-3 text-sm">
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-gray-800 rounded-lg p-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-300 font-medium truncate">{item.name}</p>
                    <p className="text-gray-500 text-xs">Qty: {item.quantity} x ₹{item.price}</p>
                  </div>
                  <p className="text-gray-300 font-semibold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-800 mt-4 pt-4 flex justify-between text-sm">
              <span className="text-gray-400">Total</span>
              <span className="text-yellow-400 font-bold text-lg">₹{selectedOrder.total.toLocaleString("en-IN")}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Delivery: {selectedOrder.address}</p>
            <button onClick={() => setSelectedOrder(null)} className="mt-4 w-full bg-gray-800 text-gray-300 py-2.5 rounded-lg font-semibold hover:bg-gray-700 transition">Close</button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default ManageOrders;
