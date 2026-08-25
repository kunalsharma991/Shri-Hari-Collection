import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFeaturedProducts } from "../services/productService";
import { effectivePrice, formatPrice } from "../utils/format";
import LoadingSpinner from "./LoadingSpinner";

function BestSellers() {
  const navigate = useNavigate();
  const [bestProducts, setBestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedProducts()
      .then((data) => setBestProducts((data || []).slice(0, 4)))
      .catch(() => setError("Unable to load best sellers right now."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-yellow-600 font-semibold text-sm uppercase tracking-widest">Most Popular</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-1">Best Sellers</h2>
        </div>

        {loading ? (
          <LoadingSpinner size={3} />
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="relative overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-black text-yellow-400 text-xs font-bold px-3 py-1 rounded-full">BESTSELLER</span>
                </div>
                <div className="p-4">
                  <span className="text-xs text-gray-500 uppercase">{product.categoryName}</span>
                  <h3 className="font-semibold text-gray-900 mt-1 truncate">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-gray-900">₹{formatPrice(effectivePrice(product))}</span>
                    {product.discountPrice && (
                      <span className="text-sm text-gray-400 line-through">₹{formatPrice(product.price)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default BestSellers;
