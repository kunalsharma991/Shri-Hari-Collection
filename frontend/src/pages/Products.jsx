import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import products from "../data/products";
import { FaSearch, FaTh, FaList, FaFilter, FaTimes, FaStar, FaChevronDown } from "react-icons/fa";
import FilterSidebar from "../components/FilterSidebar";

function Products() {
  const navigate = useNavigate();

  // Filter / sort state
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [showFilters, setShowFilters] = useState(false); // mobile toggle

  const categories = ["All", "Men", "Women", "Kids", "Footwear", "Accessories"];

  // Filtered + sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Price range
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popularity":
        result.sort((a, b) => b.popularity - a.popularity);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        break;
    }

    return result;
  }, [search, selectedCategory, priceRange, sortBy]);

  const activeFiltersCount =
    (selectedCategory !== "All" ? 1 : 0) +
    (priceRange[0] !== 0 || priceRange[1] !== 5000 ? 1 : 0);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setPriceRange([0, 5000]);
    setSortBy("default");
  };

  /* FilterSidebar moved to components/FilterSidebar for lint stability */

  return (
    <>
      <Navbar />
      <PageHeader
        title="All Products"
        subtitle="Browse our complete collection"
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Shop" }]}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* ─── Top Bar: Search + Sort + View Toggle ─── */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 bg-white focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-100 transition-all text-sm"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-full px-4 py-2.5 pr-10 text-sm text-gray-700 focus:border-yellow-500 focus:outline-none cursor-pointer"
                >
                  <option value="default">Sort By</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popularity">Popularity</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest First</option>
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="hidden sm:flex items-center border border-gray-200 rounded-full overflow-hidden bg-white">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 transition ${viewMode === "grid" ? "bg-black text-yellow-400" : "text-gray-500 hover:bg-gray-50"}`}
                >
                  <FaTh className="text-sm" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 transition ${viewMode === "list" ? "bg-black text-yellow-400" : "text-gray-500 hover:bg-gray-50"}`}
                >
                  <FaList className="text-sm" />
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm text-gray-700 hover:border-yellow-500 transition relative"
              >
                <FaFilter className="text-xs" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-yellow-500 text-black text-xs font-bold rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-8">
            {/* ─── Desktop Sidebar Filters ─── */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <FaFilter className="text-yellow-500 text-sm" />
                  Filters
                </h2>
                <FilterSidebar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  clearFilters={clearFilters}
                  activeFiltersCount={activeFiltersCount}
                  products={products}
                />
              </div>
            </aside>

            {/* ─── Mobile Filter Panel ─── */}
            {showFilters && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)}></div>
                <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl p-6 overflow-y-auto animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-lg">Filters</h2>
                    <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                      <FaTimes />
                    </button>
                  </div>
                  <FilterSidebar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    clearFilters={clearFilters}
                    activeFiltersCount={activeFiltersCount}
                    products={products}
                  />
                </div>
              </div>
            )}

            {/* ─── Product Grid / List ─── */}
            <div className="flex-1">
              {/* Results count */}
              <p className="text-sm text-gray-500 mb-4">
                Showing <strong className="text-gray-900">{filteredProducts.length}</strong> product{filteredProducts.length !== 1 && "s"}
              </p>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl text-gray-500 mb-4">No products found</p>
                  <button onClick={clearFilters} className="text-yellow-600 font-semibold hover:text-yellow-700 transition">
                    Clear Filters
                  </button>
                </div>
              ) : viewMode === "grid" ? (
                /* Grid View */
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
                    const discount = product.originalPrice
                      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                      : 0;

                    return (
                      <div
                        key={product.id}
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="relative overflow-hidden">
                          <img src={product.image} alt={product.name} className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500" />
                          {discount > 0 && (
                            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">-{discount}%</span>
                          )}
                          {product.isNew && (
                            <span className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-bold px-2.5 py-1 rounded-full">NEW</span>
                          )}
                        </div>
                        <div className="p-4">
                          <span className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</span>
                          <h3 className="font-semibold text-gray-900 mt-1 truncate">{product.name}</h3>
                          <div className="flex items-center gap-1 mt-1 text-yellow-400">
                            {Array(5).fill(0).map((_, i) => (
                              <FaStar key={i} className={`text-xs ${i < Math.floor(product.rating) ? "" : "text-gray-300"}`} />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* List View */
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-5 hover:shadow-md transition-all cursor-pointer"
                    >
                      <img src={product.image} alt={product.name} className="w-28 h-28 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-gray-500 uppercase">{product.category}</span>
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                          {product.originalPrice && <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Products;
