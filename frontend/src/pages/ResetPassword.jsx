import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const resetPassword = useAuthStore((state) => state.resetPassword);

  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.password) errs.password = "Password is required";
    else if (formData.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setTimeout(() => {
      const result = resetPassword(email, formData.password);
      setLoading(false);
      if (result.success) setSuccess(true);
      else setErrors({ general: result.message });
    }, 800);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {success ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <FaCheckCircle className="text-3xl text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Updated!</h1>
                <p className="text-gray-500 mb-6">Your password has been reset successfully.</p>
                <Link to="/login" className="inline-flex items-center gap-2 bg-black text-yellow-400 px-6 py-3 rounded-full font-semibold hover:bg-gray-900 transition-all shadow-lg">
                  Sign In Now
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black mb-4">
                    <FaLock className="text-2xl text-yellow-400" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
                  <p className="text-gray-500 mt-1">Enter your new password below</p>
                </div>

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-5">{errors.general}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><FaLock className="text-sm" /></span>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter new password"
                        className={`w-full pl-10 pr-12 py-3 rounded-xl border ${errors.password ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"} focus:border-yellow-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-100 transition-all`}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><FaLock className="text-sm" /></span>
                      <input
                        type={showConfirm ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter new password"
                        className={`w-full pl-10 pr-12 py-3 rounded-xl border ${errors.confirmPassword ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"} focus:border-yellow-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-100 transition-all`}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>

                  <button type="submit" disabled={loading} className="w-full bg-black text-yellow-400 py-3.5 rounded-full font-bold text-lg hover:bg-gray-900 transition-all duration-300 shadow-lg disabled:opacity-60">
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ResetPassword;
