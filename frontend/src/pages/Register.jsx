import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import InputField from "../components/InputField";

function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Enter a valid email";
    if (!formData.mobile.trim()) errs.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobile)) errs.mobile = "Enter a valid 10-digit number";
    if (!formData.password) errs.password = "Password is required";
    else if (formData.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = register(formData);
      setLoading(false);
      if (result.success) {
        navigate("/");
      } else {
        setErrors({ general: result.message });
      }
    }, 800);
  };

  // Uses shared InputField component

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black mb-4">
                <FaUser className="text-2xl text-yellow-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
              <p className="text-gray-500 mt-1">Join Shri Hari Collection today</p>
            </div>

            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-5">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField label="Full Name" name="fullName" type="text" placeholder="Enter your full name" icon={<FaUser className="text-sm" />} value={formData.fullName} onChange={handleChange} error={errors.fullName} />
              <InputField label="Email Address" name="email" type="email" placeholder="your.email@example.com" icon={<FaEnvelope className="text-sm" />} value={formData.email} onChange={handleChange} error={errors.email} />
              <InputField label="Mobile Number" name="mobile" type="tel" placeholder="10-digit mobile number" icon={<FaPhone className="text-sm" />} value={formData.mobile} onChange={handleChange} error={errors.mobile} />

              {/* Password with toggle */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><FaLock className="text-sm" /></span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className={`w-full pl-10 pr-12 py-3 rounded-xl border ${
                      errors.password ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                    } focus:border-yellow-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-100 transition-all`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><FaLock className="text-sm" /></span>
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className={`w-full pl-10 pr-12 py-3 rounded-xl border ${
                      errors.confirmPassword ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                    } focus:border-yellow-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-100 transition-all`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-yellow-400 py-3.5 rounded-full font-bold text-lg hover:bg-gray-900 hover:scale-[1.01] transition-all duration-300 shadow-lg disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-yellow-600 font-semibold hover:text-yellow-700 transition">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;
