import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaShieldAlt } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Where to redirect after login
  const redirectPath = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.identifier.trim() || !formData.password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = login(formData.identifier, formData.password, formData.rememberMe);
      setLoading(false);

      if (result.success) {
        navigate(redirectPath, { replace: true });
      } else {
        setError(result.message);
      }
    }, 800);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black mb-4">
                <FaShieldAlt className="text-2xl text-yellow-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-gray-500 mt-1">Sign in to your account</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-5">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email / Mobile */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email or Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaEnvelope className="text-sm" />
                  </span>
                  <input
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="Enter email or mobile number"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-yellow-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-100 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaLock className="text-sm" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-yellow-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
                  />
                  <span className="text-sm text-gray-600">Remember Me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-yellow-600 hover:text-yellow-700 font-semibold transition"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-yellow-400 py-3.5 rounded-full font-bold text-lg hover:bg-gray-900 hover:scale-[1.01] active:scale-100 transition-all duration-300 shadow-lg disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400 uppercase">or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Register Link */}
            <p className="text-center text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-yellow-600 font-semibold hover:text-yellow-700 transition"
              >
                Create Account
              </Link>
            </p>

            {/* Admin access is handled via separate admin portal — no link here */}

            {/* Demo Credentials */}
            <div className="mt-5 p-4 bg-gray-50 rounded-xl text-sm">
              <p className="font-semibold text-gray-700 mb-2">Demo Credentials:</p>
              <p className="text-gray-500">
                Customer: <span className="font-mono text-gray-700">demo@example.com</span> / <span className="font-mono text-gray-700">demo123</span>
              </p>
              <p className="text-gray-500">
                Admin: <span className="font-mono text-gray-700">admin@shrihari.com</span> / <span className="font-mono text-gray-700">admin123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
