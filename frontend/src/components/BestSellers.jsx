import { useNavigate } from "react-router-dom";
import products from "../data/products";
import { FaStar } from "react-icons/fa";

function BestSellers() {
  const navigate = useNavigate();
  const bestProducts = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-yellow-600 font-semibold text-sm uppercase tracking-widest">Most Popular</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-1">Best Sellers</h2>
        </div>

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
                <span className="text-xs text-gray-500 uppercase">{product.category}</span>
                <h3 className="font-semibold text-gray-900 mt-1 truncate">{product.name}</h3>
                <div className="flex items-center gap-1 mt-1 text-yellow-400">
                  {Array(5).fill(0).map((_, i) => (
                    <FaStar key={i} className={`text-xs ${i < Math.floor(product.rating) ? "" : "text-gray-300"}`} />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                  {product.originalPrice && <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BestSellers;
