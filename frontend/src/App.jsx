import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import WhatsAppButton from "./components/WhatsappButton";

// Public Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import ReturnPolicy from "./pages/ReturnPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";

// Protected Pages
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import AddressBook from "./pages/AddressBook";
import Wishlist from "./pages/Wishlist";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageCustomers from "./pages/admin/ManageCustomers";
import ManageCoupons from "./pages/admin/ManageCoupons";

function App() {
  // Restore auth session on app load
  const restoreSession = useAuthStore((state) => state.restoreSession);
  useEffect(() => { restoreSession(); }, [restoreSession]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* ─── Public Routes ─── */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        {/* Legacy /shop alias for SEO and external links */}
        <Route path="/shop" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Admin login path — canonical: /admin/login */}
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* Redirect old admin-login route to new canonical path */}
        <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/terms-and-conditions" element={<Terms />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/return-refund-policy" element={<ReturnPolicy />} />

        {/* Orders alias */}
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />

        {/* ─── Protected Routes (require login) ─── */}
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="/address-book" element={<ProtectedRoute><AddressBook /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

        {/* ─── Admin Routes (require admin role) ─── */}
        <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><ManageProducts /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><ManageOrders /></AdminRoute>} />
        <Route path="/admin/customers" element={<AdminRoute><ManageCustomers /></AdminRoute>} />
        <Route path="/admin/coupons" element={<AdminRoute><ManageCoupons /></AdminRoute>} />
      </Routes>

      {/* Floating WhatsApp Button on all pages */}
      <WhatsAppButton />
    </BrowserRouter>
  );
}

export default App;
