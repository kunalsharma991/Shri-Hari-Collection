import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useCartStore from "../store/cartStore";
import { FaShoppingBag, FaTrash, FaMinus, FaPlus, FaArrowLeft } from "react-icons/fa";

function Cart() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCartStore();

  // Calculate grand total
  const grandTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  /* ─── Empty Cart State ─── */
  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-[80vh] bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
          <div className="text-center px-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-6">
              <FaShoppingBag className="text-4xl text-gray-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Your Cart is Empty</h1>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Explore our premium collection!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-black text-yellow-400 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-900 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <FaShoppingBag />
              Start Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  /* ─── Cart with Items ─── */
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Page Header */}
          <div className="mb-10">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition mb-4 text-sm"
            >
              <FaArrowLeft className="text-xs" />
              Continue Shopping
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">
              Shopping <span className="text-yellow-500">Cart</span>
            </h1>
            <p className="text-gray-500 mt-1">{totalItems} item{totalItems !== 1 && "s"} in your cart</p>
          </div>

          {/* Cart Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ─── Cart Items List ─── */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex flex-col sm:flex-row gap-5">

                    {/* Product Image */}
                    <div className="w-full sm:w-32 h-40 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-xs font-semibold text-yellow-600 uppercase tracking-wider">
                            {item.category}
                          </span>
                          <h3 className="text-lg font-bold text-gray-900 mt-0.5">{item.name}</h3>
                          <p className="text-sm text-gray-500 mt-0.5">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition p-2 rounded-full hover:bg-red-50"
                          title="Remove Item"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>

                      {/* Quantity & Subtotal Row */}
                      <div className="flex justify-between items-center mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-gray-50">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            disabled={item.quantity <= 1}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <FaMinus className="text-xs" />
                          </button>
                          <span className="px-4 py-2 font-semibold text-gray-900 min-w-[2.5rem] text-center bg-white border-x border-gray-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-200 transition"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <p className="text-xl font-bold text-gray-900">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ─── Order Summary Sidebar ─── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-yellow-500 rounded-full inline-block"></span>
                  Order Summary
                </h2>

                {/* Price Breakdown */}
                <div className="space-y-3 text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-semibold text-gray-900">₹{grandTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">
                      {grandTotal >= 500 ? "FREE" : "₹50"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Free shipping on orders above ₹500</span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-4"></div>

                  {/* Grand Total */}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Grand Total</span>
                    <span className="text-2xl font-extrabold text-yellow-600">
                      ₹{(grandTotal + (grandTotal >= 500 ? 0 : 50)).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-black text-yellow-400 py-4 rounded-full font-bold text-lg hover:bg-gray-900 hover:scale-[1.02] active:scale-100 transition-all duration-300 shadow-lg"
                >
                  Proceed to Checkout
                  <FaArrowLeft className="rotate-180 text-sm" />
                </Link>

                {/* Continue Shopping */}
                <Link
                  to="/products"
                  className="mt-3 w-full flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 py-3 rounded-full font-semibold hover:border-black hover:text-black transition-all duration-300"
                >
                  <FaShoppingBag className="text-sm" />
                  Continue Shopping
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
                  {["Secure Payment", "Easy Returns", "Authentic Products"].map((badge) => (
                    <div key={badge} className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                      {badge}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Cart;
