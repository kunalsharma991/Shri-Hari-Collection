import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../services/productService";
import { effectivePrice, formatPrice } from "../utils/format";
import LoadingSpinner from "./LoadingSpinner";

function NewArrivals() {
  const navigate = useNavigate();
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts({ size: 4 })
      .then((data) => setNewProducts(data?.content || []))
      .catch(() => setError("Unable to load new arrivals right now."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-yellow-600 font-semibold text-sm uppercase tracking-widest">Just Dropped</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-1">New Arrivals</h2>
          </div>
          <button onClick={() => navigate("/products")} className="hidden sm:inline-flex text-yellow-600 font-semibold hover:text-yellow-700 transition border-b-2 border-yellow-500 pb-0.5">
            View All
          </button>
        </div>

        {loading ? (
          <LoadingSpinner size={3} />
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="relative overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">NEW</span>
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

export default NewArrivals;
