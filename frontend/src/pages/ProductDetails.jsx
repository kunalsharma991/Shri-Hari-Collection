import { useParams, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import { fetchProduct, fetchProductBySlug, fetchProducts } from "../services/productService";
import { getErrorMessage } from "../services/axiosConfig";
import { discountPercent, effectivePrice, formatPrice } from "../utils/format";

const IMAGE_FALLBACK =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="20">Image Not Available</text></svg>';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [cartMessage, setCartMessage] = useState(null);

  // The route param is a numeric id for backend products, but slugs also resolve
  const loadProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCartMessage(null);
    try {
      const data = /^\d+$/.test(id) ? await fetchProduct(id) : await fetchProductBySlug(id);
      setProduct(data);
      setQuantity(1);

      if (data?.categoryId) {
        const page = await fetchProducts({ category: data.categoryId, size: 4 });
        setRelated((page?.content || []).filter((p) => p.id !== data.id).slice(0, 3));
      } else {
        setRelated([]);
      }
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load this product."));
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/product/${id}` } } });
      return;
    }
    setAdding(true);
    setCartMessage(null);
    const result = await addToCart(product.id, quantity);
    setAdding(false);
    setCartMessage(
      result.success
        ? { type: "success", text: "Added to your cart." }
        : { type: "error", text: result.message }
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <LoadingSpinner size={3} />
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">{error || "Product Not Found"}</h1>
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

  const discount = discountPercent(product);
  const inStock = (product.stockQuantity ?? 0) > 0;

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) setQuantity(value);
  };

  const handleIncrement = () => setQuantity(Math.min(quantity + 1, product.stockQuantity || 1));
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
                  src={product.image || IMAGE_FALLBACK}
                  alt={product.name}
                  onError={(e) => (e.currentTarget.src = IMAGE_FALLBACK)}
                  className="w-full h-96 md:h-96 object-cover rounded-xl shadow-lg"
                />
                {discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                    -{discount}%
                  </div>
                )}
                {inStock ? (
                  <div className="absolute bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    In Stock
                  </div>
                ) : (
                  <div className="absolute bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Out of Stock
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="flex flex-col justify-center">
              {/* Category */}
              <span className="text-yellow-600 font-semibold text-sm mb-2 uppercase">
                {product.categoryName}
              </span>

              {/* Product Name */}
              <h1 className="text-4xl font-bold mb-4 text-gray-900">
                {product.name}
              </h1>

              {/* Price Section */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{formatPrice(effectivePrice(product))}
                </span>
                {discount > 0 && (
                  <span className="text-xl text-gray-500 line-through">
                    ₹{formatPrice(product.price)}
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
                <p className="text-gray-600 text-sm">
                  {product.brand && <>Brand: {product.brand} · </>}
                  SKU: {product.sku} · {product.stockQuantity} in stock
                </p>
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

              {/* Cart feedback */}
              {cartMessage && (
                <p
                  className={`mb-4 text-sm font-semibold ${
                    cartMessage.type === "success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {cartMessage.text}
                </p>
              )}

              {/* Add to Cart and Wishlist Buttons */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={adding || !inStock}
                  className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-50"
                >
                  {adding ? "Adding..." : `Add To Cart (${quantity})`}
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
        {related.length > 0 && (
          <div className="bg-gray-50 py-12 mt-12">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8">Related Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((relatedProduct) => (
                  <div
                    key={relatedProduct.id}
                    onClick={() => navigate(`/product/${relatedProduct.id}`)}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition cursor-pointer"
                  >
                    <img
                      src={relatedProduct.image || IMAGE_FALLBACK}
                      alt={relatedProduct.name}
                      onError={(e) => (e.currentTarget.src = IMAGE_FALLBACK)}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{relatedProduct.name}</h3>
                      <p className="text-yellow-600 font-bold mt-2">
                        ₹{formatPrice(effectivePrice(relatedProduct))}
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
        )}
      </div>
      <Footer />
    </>
  );
}

export default ProductDetails;
