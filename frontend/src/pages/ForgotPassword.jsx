import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from "react-icons/fa";

function ForgotPassword() {
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = forgotPassword(email);
      setLoading(false);
      if (result.success) {
        setSuccess(true);
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
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {success ? (
              /* Success State */
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <FaCheckCircle className="text-3xl text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
                <p className="text-gray-500 mb-6">
                  We've sent a password reset link to <strong>{email}</strong>. Please check your inbox.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-yellow-600 font-semibold hover:text-yellow-700 transition"
                >
                  <FaArrowLeft className="text-xs" />
                  Back to Login
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black mb-4">
                    <FaEnvelope className="text-2xl text-yellow-400" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">Forgot Password?</h1>
                  <p className="text-gray-500 mt-1">No worries, we'll send you reset instructions</p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-5">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <FaEnvelope className="text-sm" />
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        placeholder="Enter your registered email"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-yellow-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-100 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-yellow-400 py-3.5 rounded-full font-bold text-lg hover:bg-gray-900 transition-all duration-300 shadow-lg disabled:opacity-60"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>

                <div className="text-center mt-6">
                  <Link to="/login" className="inline-flex items-center gap-2 text-yellow-600 font-semibold hover:text-yellow-700 transition">
                    <FaArrowLeft className="text-xs" />
                    Back to Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ForgotPassword;
