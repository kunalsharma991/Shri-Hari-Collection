import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaShieldAlt } from "react-icons/fa";

function AdminLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const result = await login(formData.email.trim(), formData.password);
    setLoading(false);

    if (result.success && useAuthStore.getState().role === "admin") {
      navigate("/admin/dashboard");
    } else if (result.success) {
      // Signed in, but without admin privileges
      await useAuthStore.getState().logout();
      setError("Access denied. Admin credentials required.");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 border-2 border-yellow-500 mb-4">
              <FaShieldAlt className="text-2xl text-yellow-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
            <p className="text-gray-400 mt-1">Shri Hari Collection - Management</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Admin Email</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <FaEnvelope className="text-sm" />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter admin email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <FaLock className="text-sm" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter admin password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 text-black py-3.5 rounded-full font-bold text-lg hover:bg-yellow-400 transition-all duration-300 shadow-lg disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </span>
              ) : (
                "Access Admin Panel"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
