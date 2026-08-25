import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import useWishlistStore from "../store/wishlistStore";
import useCartStore from "../store/cartStore";
import { FaHeart, FaShoppingCart, FaTrash, FaEye } from "react-icons/fa";

function Wishlist() {
  const { wishlist, removeItem } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const [moveError, setMoveError] = useState(null);

  const handleMoveToCart = async (product) => {
    const result = await addToCart(product.id, 1);
    if (result.success) removeItem(product.id);
    else setMoveError(result.message);
  };

  return (
    <>
      <Navbar />
      <PageHeader
        title="My Wishlist"
        subtitle={`${wishlist.length} item${wishlist.length !== 1 ? "s" : ""} saved`}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Wishlist" }]}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {moveError && <p className="mb-6 text-sm font-semibold text-red-600">{moveError}</p>}
          {wishlist.length === 0 ? (
            <EmptyState
              icon={FaHeart}
              title="Your Wishlist is Empty"
              description="Save your favorite products to your wishlist and come back to them anytime!"
              actionLabel="Explore Products"
              actionLink="/products"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    {/* Remove button */}
                    <button
                      onClick={() => removeItem(product.id)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-red-400 hover:text-red-600 shadow-sm hover:shadow transition-all"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <span className="text-xs font-semibold text-yellow-600 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 mt-1 truncate">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-black text-yellow-400 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-900 transition-all"
                      >
                        <FaShoppingCart className="text-xs" /> Move to Cart
                      </button>
                      <Link
                        to={`/product/${product.id}`}
                        className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:border-black hover:text-black transition-all"
                      >
                        <FaEye className="text-sm" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Wishlist;
