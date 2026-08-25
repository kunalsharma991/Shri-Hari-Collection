import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import products from "../data/products";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useCartStore from "../store/cartStore";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === parseInt(id));
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);

  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
            <button
              onClick={() => navigate("/products")}
              className="bg-black text-white px-6 py-2 rounded-lg"
            >
              Back to Products
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) setQuantity(value);
  };

  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate("/products")}
            className="text-gray-600 hover:text-black transition"
          >
            ← Back to Products
          </button>
        </div>

        {/* Product Details Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) =>
                    (e.currentTarget.src =
                      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="20">Image Not Available</text></svg>')
                  }
                  className="w-full h-96 md:h-96 object-cover rounded-xl shadow-lg"
                />
                {discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                    -{discount}%
                  </div>
                )}
                {product.inStock && (
                  <div className="absolute bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    In Stock
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="flex flex-col justify-center">
              {/* Category */}
              <span className="text-yellow-600 font-semibold text-sm mb-2 uppercase">
                {product.category}
              </span>

              {/* Product Name */}
              <h1 className="text-4xl font-bold mb-4 text-gray-900">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i} className="text-lg">
                        {i < Math.floor(product.rating) ? "★" : "☆"}
                      </span>
                    ))}
                </div>
                <span className="ml-3 text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price Section */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Product Details */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Product Details:</h3>
                <p className="text-gray-600 text-sm">{product.details}</p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <label className="font-semibold text-gray-900">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={handleDecrement}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-16 text-center border-0 focus:outline-none"
                    min="1"
                  />
                  <button
                    onClick={handleIncrement}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart and Wishlist Buttons */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => addToCart({ ...product, quantity })}
                  className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
                >
                  Add To Cart ({quantity})
                </button>
                <button className="flex-1 border-2 border-black text-black py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
                  ♡ Wishlist
                </button>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>✓ Free Shipping on orders above ₹500</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>✓ 7 Days Easy Returns & Exchange</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>✓ Authentic Products Guaranteed</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>✓ Secure Payments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="bg-gray-50 py-12 mt-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products
                .filter((p) => p.category === product.category && p.id !== product.id)
                .slice(0, 3)
                .map((relatedProduct) => (
                  <div
                    key={relatedProduct.id}
                    onClick={() => navigate(`/product/${relatedProduct.id}`)}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition cursor-pointer"
                  >
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      onError={(e) =>
                        (e.currentTarget.src =
                          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="18">Image Not Available</text></svg>')
                      }
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{relatedProduct.name}</h3>
                      <p className="text-yellow-600 font-bold mt-2">
                        ₹{relatedProduct.price}
                      </p>
                      <button className="w-full mt-4 bg-black text-white py-2 rounded-lg">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductDetails;
