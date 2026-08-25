import { useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { FaSearch, FaBan, FaCheck, FaEye } from "react-icons/fa";

const mockCustomers = [
  { id: 1, name: "Demo Customer", email: "demo@example.com", mobile: "9999999999", orders: 5, totalSpent: 15689, joined: "2026-01-15", isBlocked: false },
  { id: 2, name: "Priya Sharma", email: "priya@gmail.com", mobile: "9876543210", orders: 12, totalSpent: 34500, joined: "2025-11-20", isBlocked: false },
  { id: 3, name: "Rahul Kumar", email: "rahul@gmail.com", mobile: "8765432109", orders: 3, totalSpent: 8997, joined: "2026-02-10", isBlocked: false },
  { id: 4, name: "Anita Gupta", email: "anita@gmail.com", mobile: "7654321098", orders: 8, totalSpent: 22450, joined: "2025-09-05", isBlocked: true },
  { id: 5, name: "Vikash Singh", email: "vikash@gmail.com", mobile: "6543210987", orders: 2, totalSpent: 5998, joined: "2026-03-22", isBlocked: false },
];

function ManageCustomers() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [search, setSearch] = useState("");

  const filtered = customers.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  const toggleBlock = (id) => {
    setCustomers(customers.map((c) => c.id === id ? { ...c, isBlocked: !c.isBlocked } : c));
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-white mb-6">Manage Customers</h1>

      <div className="relative mb-4 max-w-md">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none text-sm" />
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500">
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium">Mobile</th>
                <th className="text-left px-5 py-3 font-medium">Orders</th>
                <th className="text-left px-5 py-3 font-medium">Total Spent</th>
                <th className="text-left px-5 py-3 font-medium">Joined</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                  <td className="px-5 py-3">
                    <div>
                      <p className="text-gray-300 font-medium">{c.name}</p>
                      <p className="text-gray-500 text-xs">{c.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{c.mobile}</td>
                  <td className="px-5 py-3 text-gray-300">{c.orders}</td>
                  <td className="px-5 py-3 text-gray-300 font-semibold">₹{c.totalSpent.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3 text-gray-400">{new Date(c.joined).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c.isBlocked ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>
                      {c.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-yellow-400 transition" title="View Profile"><FaEye /></button>
                      <button onClick={() => toggleBlock(c.id)} className={`p-2 rounded-lg hover:bg-gray-800 transition ${c.isBlocked ? "text-green-400 hover:text-green-300" : "text-red-400 hover:text-red-300"}`} title={c.isBlocked ? "Unblock" : "Block"}>
                        {c.isBlocked ? <FaCheck /> : <FaBan />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ManageCustomers;
