import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import { FaSearch, FaTh, FaList, FaFilter, FaTimes, FaChevronDown } from "react-icons/fa";
import FilterSidebar from "../components/FilterSidebar";
import { fetchProducts } from "../services/productService";
import { fetchCategories } from "../services/categoryService";
import { getErrorMessage } from "../services/axiosConfig";
import { discountPercent, effectivePrice, formatPrice } from "../utils/format";

const PAGE_SIZE = 12;
const MAX_PRICE = 5000;
const ALL = "all";

// UI sort value -> backend sort parameter
const SORT_PARAMS = {
  default: undefined,
  "price-low": "price_asc",
  "price-high": "price_desc",
  "name-asc": "name_asc",
  newest: "createdAt",
};

function ProductImage({ product, className }) {
  return (
    <img
      src={product.image || "/images/products/shirt.jpg"}
      alt={product.name}
      onError={(e) => {
        e.currentTarget.src =
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="18">Image Not Available</text></svg>';
      }}
      className={className}
    />
  );
}

function Products() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Filter / sort state
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") ? Number(searchParams.get("category")) : ALL
  );
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [showFilters, setShowFilters] = useState(false); // mobile toggle
  const [page, setPage] = useState(0);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce the search box so we do not hit the API on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let active = true;
    fetchCategories()
      .then((data) => {
        if (active) setCategories(data || []);
      })
      .catch(() => {
        if (active) setCategories([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts({
        search: search || undefined,
        category: selectedCategory === ALL ? undefined : selectedCategory,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < MAX_PRICE ? priceRange[1] : undefined,
        sort: SORT_PARAMS[sortBy],
        page,
        size: PAGE_SIZE,
      });
      setProducts(data?.content || []);
      setTotalElements(data?.totalElements || 0);
      setTotalPages(data?.totalPages || 0);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load products."));
      setProducts([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, priceRange, sortBy, page]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const activeFiltersCount =
    (selectedCategory !== ALL ? 1 : 0) +
    (priceRange[0] !== 0 || priceRange[1] !== MAX_PRICE ? 1 : 0);

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setSelectedCategory(ALL);
    setPriceRange([0, MAX_PRICE]);
    setSortBy("default");
    setPage(0);
  };

  const categoryOptions = [{ id: ALL, name: "All" }, ...categories];

  const filterProps = {
    categories: categoryOptions,
    selectedCategory,
    setSelectedCategory: (id) => {
      setSelectedCategory(id);
      setPage(0);
    },
    priceRange,
    setPriceRange: (range) => {
      setPriceRange(range);
      setPage(0);
    },
    clearFilters,
    activeFiltersCount,
  };

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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 bg-white focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-100 transition-all text-sm"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(0);
                  }}
                  className="appearance-none bg-white border border-gray-200 rounded-full px-4 py-2.5 pr-10 text-sm text-gray-700 focus:border-yellow-500 focus:outline-none cursor-pointer"
                >
                  <option value="default">Sort By</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
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
                <FilterSidebar {...filterProps} />
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
                  <FilterSidebar {...filterProps} />
                </div>
              </div>
            )}

            {/* ─── Product Grid / List ─── */}
            <div className="flex-1">
              {/* Results count */}
              <p className="text-sm text-gray-500 mb-4">
                Showing <strong className="text-gray-900">{products.length}</strong> of{" "}
                <strong className="text-gray-900">{totalElements}</strong> product{totalElements !== 1 && "s"}
              </p>

              {loading ? (
                <div className="py-20">
                  <LoadingSpinner size={3} />
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-lg text-red-600 mb-4">{error}</p>
                  <button onClick={loadProducts} className="text-yellow-600 font-semibold hover:text-yellow-700 transition">
                    Try Again
                  </button>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl text-gray-500 mb-4">No products found</p>
                  <button onClick={clearFilters} className="text-yellow-600 font-semibold hover:text-yellow-700 transition">
                    Clear Filters
                  </button>
                </div>
              ) : viewMode === "grid" ? (
                /* Grid View */
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => {
                    const discount = discountPercent(product);

                    return (
                      <div
                        key={product.id}
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="relative overflow-hidden">
                          <ProductImage product={product} className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500" />
                          {discount > 0 && (
                            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">-{discount}%</span>
                          )}
                          {product.featured && (
                            <span className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-bold px-2.5 py-1 rounded-full">FEATURED</span>
                          )}
                        </div>
                        <div className="p-4">
                          <span className="text-xs text-gray-500 uppercase tracking-wider">{product.categoryName}</span>
                          <h3 className="font-semibold text-gray-900 mt-1 truncate">{product.name}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg font-bold text-gray-900">₹{formatPrice(effectivePrice(product))}</span>
                            {discount > 0 && (
                              <span className="text-sm text-gray-400 line-through">₹{formatPrice(product.price)}</span>
                            )}
                          </div>
                          {product.stockQuantity === 0 && (
                            <p className="text-xs text-red-500 font-semibold mt-1">Out of stock</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* List View */
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-5 hover:shadow-md transition-all cursor-pointer"
                    >
                      <ProductImage product={product} className="w-28 h-28 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-gray-500 uppercase">{product.categoryName}</span>
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-bold text-gray-900">₹{formatPrice(effectivePrice(product))}</span>
                          {discountPercent(product) > 0 && (
                            <span className="text-sm text-gray-400 line-through">₹{formatPrice(product.price)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ─── Pagination ─── */}
              {!loading && !error && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-700 disabled:opacity-40 hover:border-yellow-500 transition"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-full text-sm font-semibold transition ${
                        p === page ? "bg-black text-yellow-400" : "bg-white border border-gray-200 text-gray-700 hover:border-yellow-500"
                      }`}
                    >
                      {p + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-700 disabled:opacity-40 hover:border-yellow-500 transition"
                  >
                    Next
                  </button>
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
