import { useNavigate } from "react-router-dom";
import products from "../data/products";

function NewArrivals() {
  const navigate = useNavigate();
  const newProducts = products.filter((p) => p.isNew).slice(0, 4);

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
                <span className="text-xs text-gray-500 uppercase">{product.category}</span>
                <h3 className="font-semibold text-gray-900 mt-1 truncate">{product.name}</h3>
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

export default NewArrivals;
