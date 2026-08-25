import AdminLayout from "../../components/AdminLayout";
import StatusBadge from "../../components/StatusBadge";
import products from "../../data/products";
import orders from "../../data/orders";
import { FaBox, FaShoppingBag, FaMoneyBillWave, FaUsers, FaArrowUp, FaArrowDown } from "react-icons/fa";

function Dashboard() {
  const totalRevenue = orders.reduce((sum, o) => o.status !== "cancelled" ? sum + o.total : sum, 0);

  const stats = [
    { icon: FaBox, label: "Total Products", value: products.length, change: "+3", up: true, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    { icon: FaShoppingBag, label: "Total Orders", value: orders.length, change: "+12", up: true, color: "bg-green-500/10 text-green-400 border-green-500/20" },
    { icon: FaMoneyBillWave, label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, change: "+8%", up: true, color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
    { icon: FaUsers, label: "Customers", value: 248, change: "+24", up: true, color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${stat.color}`}>
                <stat.icon />
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold ${stat.up ? "text-green-400" : "text-red-400"}`}>
                {stat.up ? <FaArrowUp className="text-[10px]" /> : <FaArrowDown className="text-[10px]" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recent Orders</h2>
          <a href="/admin/orders" className="text-sm text-yellow-400 hover:text-yellow-300 transition">View All</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500">
                <th className="text-left px-5 py-3 font-medium">Order ID</th>
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-5 py-3 font-medium">Amount</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                  <td className="px-5 py-3 font-semibold text-yellow-400">#{order.id}</td>
                  <td className="px-5 py-3 text-gray-300">Demo Customer</td>
                  <td className="px-5 py-3 text-gray-400">{new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                  <td className="px-5 py-3 text-gray-300 font-semibold">₹{order.total.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Sales Placeholder */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 mt-6">
        <h2 className="text-lg font-bold text-white mb-4">Monthly Sales Overview</h2>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
          {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((month, i) => {
            const heights = [40, 55, 35, 65, 80, 70, 50, 90, 60, 75, 85, 95];
            return (
              <div key={month} className="flex flex-col items-center gap-1">
                <div className="w-full bg-gray-800 rounded-t-lg relative" style={{ height: "120px" }}>
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t-sm transition-all" style={{ height: `${heights[i]}%` }}></div>
                </div>
                <span className="text-[10px] text-gray-500">{month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
