import { Link } from "react-router-dom";
import { useState } from "react";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const cart = useCartStore((state) => state.cart);
  // Sum of all quantities in cart
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Shop" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  if (!isAuthenticated) {
    navLinks.push({ to: "/login", label: "Login" });
  } else {
    navLinks.push({ to: "/profile", label: "Profile" });
    navLinks.push({ to: "/", label: "Logout", action: logout });
  }

  return (
    <nav className="bg-black text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-wide">
              <span className="text-yellow-400">Shri Hari</span>{" "}
              <span className="text-white">Collection</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-7 font-medium">
            {navLinks.map((link) => (
              <li key={link.to + link.label}>
                {link.action ? (
                  <button
                    onClick={link.action}
                    className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 relative group"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    to={link.to}
                    className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
              </li>
            ))}

            {/* Cart Link with Badge */}
            <li>
              <Link
                to="/cart"
                className="relative flex items-center gap-1.5 bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold hover:bg-yellow-400 transition-all duration-200"
              >
                <FaShoppingCart className="text-sm" />
                Cart
                {totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-pulse">
                    {totalQuantity}
                  </span>
                )}
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button + Cart */}
          <div className="flex md:hidden items-center gap-3">
            {/* Mobile Cart */}
            <Link
              to="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500 text-black hover:bg-yellow-400 transition"
            >
              <FaShoppingCart />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2 rounded-lg hover:bg-gray-800 transition"
            >
              {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 pb-4 animate-fade-in">
            <ul className="flex flex-col gap-1 mt-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-yellow-400 hover:bg-gray-900 rounded-lg transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
