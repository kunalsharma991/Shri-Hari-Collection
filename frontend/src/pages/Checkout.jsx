import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useCartStore from "../store/cartStore";
import { FaArrowLeft, FaLock, FaMoneyBillWave, FaCreditCard, FaShoppingBag } from "react-icons/fa";
import InputField from "../components/InputField";

function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCartStore();

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod", // "cod" or "online"
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Order calculations
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 500 ? 0 : 50;
  const grandTotal = subtotal + shipping;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // If cart is empty, render empty checkout state (hooks must be declared above)
  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-[80vh] bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
          <div className="text-center px-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Items to Checkout</h1>
            <p className="text-gray-500 mb-6">Your cart is empty. Add some products first!</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-black text-yellow-400 px-8 py-4 rounded-full font-semibold hover:bg-gray-900 transition-all duration-300 shadow-lg"
            >
              <FaShoppingBag />
              Browse Products
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobile.trim())) newErrors.mobile = "Enter a valid 10-digit mobile number";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) newErrors.email = "Enter a valid email address";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pincode.trim())) newErrors.pincode = "Enter a valid 6-digit pincode";
    return newErrors;
  };

  // Handle place order
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsProcessing(true);

    // Simulate order processing
    setTimeout(() => {
      // Generate unique order number
      const orderNumber = `SHC${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 100)}`;

      // Store order details in sessionStorage for the success page
      const orderDetails = {
        orderNumber,
        items: [...cart],
        totalQuantity,
        grandTotal,
        shipping,
        customer: { ...formData },
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      };
      sessionStorage.setItem("lastOrder", JSON.stringify(orderDetails));

      // Clear the cart
      clearCart();

      // Navigate to success page
      navigate("/order-success");
    }, 1500);
  };

  // Uses shared InputField component

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Page Header */}
          <div className="mb-10">
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition mb-4 text-sm"
            >
              <FaArrowLeft className="text-xs" />
              Back to Cart
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">
              Check<span className="text-yellow-500">out</span>
            </h1>
            <p className="text-gray-500 mt-1">Complete your order securely</p>
          </div>

          <form onSubmit={handlePlaceOrder}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* ─── Left: Customer Info & Payment ─── */}
              <div className="lg:col-span-2 space-y-8">

                {/* Customer Information Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-yellow-500 rounded-full inline-block"></span>
                    Customer Information
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <InputField label="Full Name" name="fullName" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} error={errors.fullName} />
                    <InputField label="Mobile Number" name="mobile" type="tel" placeholder="10-digit mobile number" value={formData.mobile} onChange={handleChange} error={errors.mobile} />
                    <div className="sm:col-span-2">
                      <InputField label="Email Address" name="email" type="email" placeholder="your.email@example.com" value={formData.email} onChange={handleChange} error={errors.email} />
                    </div>
                    <div className="sm:col-span-2">
                      <InputField label="Full Address" name="address" placeholder="House No., Street, Locality" value={formData.address} onChange={handleChange} error={errors.address} />
                    </div>
                    <InputField label="City" name="city" placeholder="Enter city" value={formData.city} onChange={handleChange} error={errors.city} />
                    <InputField label="State" name="state" placeholder="Enter state" value={formData.state} onChange={handleChange} error={errors.state} />
                    <InputField label="Pincode" name="pincode" type="tel" placeholder="6-digit pincode" value={formData.pincode} onChange={handleChange} error={errors.pincode} />
                  </div>
                </div>

                {/* Payment Method Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-yellow-500 rounded-full inline-block"></span>
                    Payment Method
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Cash On Delivery */}
                    <label
                      className={`relative flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        formData.paymentMethod === "cod"
                          ? "border-yellow-500 bg-yellow-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          formData.paymentMethod === "cod"
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-200 text-gray-500"
                        } transition-all`}
                      >
                        <FaMoneyBillWave className="text-lg" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Cash On Delivery</p>
                        <p className="text-sm text-gray-500">Pay when you receive</p>
                      </div>
                      {formData.paymentMethod === "cod" && (
                        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-yellow-500"></div>
                      )}
                    </label>

                    {/* Online Payment */}
                    <label
                      className={`relative flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        formData.paymentMethod === "online"
                          ? "border-yellow-500 bg-yellow-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={formData.paymentMethod === "online"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          formData.paymentMethod === "online"
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-200 text-gray-500"
                        } transition-all`}
                      >
                        <FaCreditCard className="text-lg" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Online Payment</p>
                        <p className="text-sm text-gray-500">UPI, Card, Net Banking</p>
                      </div>
                      {formData.paymentMethod === "online" && (
                        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-yellow-500"></div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* ─── Right: Order Summary Sidebar ─── */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">

                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-yellow-500 rounded-full inline-block"></span>
                    Order Summary
                  </h2>

                  {/* Cart Items Preview */}
                  <div className="space-y-3 max-h-52 overflow-y-auto mb-5 pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-4"></div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 text-gray-600 text-sm">
                    <div className="flex justify-between">
                      <span>Product Count</span>
                      <span className="font-semibold text-gray-900">{cart.length} items</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Quantity</span>
                      <span className="font-semibold text-gray-900">{totalQuantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-semibold text-green-600">
                        {shipping === 0 ? "FREE" : `₹${shipping}`}
                      </span>
                    </div>

                    <div className="border-t border-gray-200 my-3"></div>

                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-gray-900">Grand Total</span>
                      <span className="text-2xl font-extrabold text-yellow-600">
                        ₹{grandTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-black text-yellow-400 py-4 rounded-full font-bold text-lg hover:bg-gray-900 hover:scale-[1.02] active:scale-100 transition-all duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaLock className="text-sm" />
                        Place Order
                      </>
                    )}
                  </button>

                  {/* Back to Cart */}
                  <Link
                    to="/cart"
                    className="mt-3 w-full flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 py-3 rounded-full font-semibold hover:border-black hover:text-black transition-all duration-300"
                  >
                    <FaArrowLeft className="text-xs" />
                    Back to Cart
                  </Link>

                  {/* Security Badge */}
                  <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <FaLock />
                    <span>Secure & Encrypted Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Checkout;
