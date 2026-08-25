import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import {
  FaTachometerAlt, FaBox, FaShoppingBag, FaUsers, FaTags,
  FaSignOutAlt, FaBars, FaShieldAlt, FaChevronLeft,
} from "react-icons/fa";

function SidebarContent({ menuItems, location, setSidebarOpen, user, handleLogout }) {
  return (
    <>
      {/* Brand */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-yellow-400">SHC Admin</h1>
        <p className="text-xs text-gray-500 mt-1">Management Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <item.icon className="text-base" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
            <span className="text-sm font-bold text-black">{user?.fullName?.charAt(0)}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition"
        >
          <FaSignOutAlt className="text-base" />
          Logout
        </button>
      </div>
    </>
  );
}

function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { icon: FaTachometerAlt, label: "Dashboard", path: "/admin/dashboard" },
    { icon: FaBox, label: "Products", path: "/admin/products" },
    { icon: FaShoppingBag, label: "Orders", path: "/admin/orders" },
    { icon: FaUsers, label: "Customers", path: "/admin/customers" },
    { icon: FaTags, label: "Coupons", path: "/admin/coupons" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900 border-r border-gray-800 flex-shrink-0">
        <SidebarContent menuItems={menuItems} location={location} setSidebarOpen={setSidebarOpen} user={user} handleLogout={handleLogout} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)}></div>
          <aside className="absolute left-0 top-0 h-full w-64 bg-gray-900 flex flex-col animate-fade-in">
            <SidebarContent menuItems={menuItems} location={location} setSidebarOpen={setSidebarOpen} user={user} handleLogout={handleLogout} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Bar */}
        <header className="bg-gray-900 border-b border-gray-800 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white transition">
              <FaBars className="text-lg" />
            </button>
            <Link to="/" className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-yellow-400 transition">
              <FaChevronLeft className="text-xs" />
              Back to Store
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <FaShieldAlt className="text-yellow-500" />
            <span className="text-sm font-semibold text-gray-300">Admin Panel</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
