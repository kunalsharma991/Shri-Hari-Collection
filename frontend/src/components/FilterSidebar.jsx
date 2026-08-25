import { FaTimes } from "react-icons/fa";

function FilterSidebar({ categories, selectedCategory, setSelectedCategory, priceRange, setPriceRange, clearFilters, activeFiltersCount, products }) {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`block w-full text-left px-4 py-2 rounded-lg text-sm transition ${
                selectedCategory === cat
                  ? "bg-yellow-50 text-yellow-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat}
              <span className="text-gray-400 ml-1">
                ({cat === "All" ? products.length : products.filter((p) => p.category === cat).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full accent-yellow-500"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Clear */}
      {activeFiltersCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full text-sm text-red-500 font-semibold hover:text-red-700 transition flex items-center justify-center gap-1"
        >
          <FaTimes className="text-xs" /> Clear All Filters
        </button>
      )}
    </div>
  );
}

export default FilterSidebar;
