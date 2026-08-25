import { useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import Modal from "../../components/Modal";
import products from "../../data/products";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaImage } from "react-icons/fa";

function ManageProducts() {
  const [productList, setProductList] = useState(products);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: "", originalPrice: "", category: "Men", description: "", inStock: true });

  const filtered = productList.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditingId(null); setFormData({ name: "", price: "", originalPrice: "", category: "Men", description: "", inStock: true }); setModalOpen(true); };
  const openEdit = (p) => { setEditingId(p.id); setFormData({ name: p.name, price: p.price, originalPrice: p.originalPrice || "", category: p.category, description: p.description, inStock: p.inStock }); setModalOpen(true); };

  const handleSave = () => {
    if (editingId) {
      setProductList(productList.map((p) => p.id === editingId ? { ...p, ...formData, price: Number(formData.price), originalPrice: Number(formData.originalPrice) } : p));
    } else {
      setProductList([...productList, { ...formData, id: Date.now(), price: Number(formData.price), originalPrice: Number(formData.originalPrice), image: "/images/products/shirt.jpg", rating: 4.0, reviews: 0 }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => { setProductList(productList.filter((p) => p.id !== id)); };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Products</h1>
        <button onClick={openAdd} className="flex items-center justify-center gap-2 bg-yellow-500 text-black px-5 py-2.5 rounded-lg font-semibold hover:bg-yellow-400 transition text-sm">
          <FaPlus className="text-xs" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-md">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none text-sm" />
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500">
                <th className="text-left px-5 py-3 font-medium">Product</th>
                <th className="text-left px-5 py-3 font-medium">Category</th>
                <th className="text-left px-5 py-3 font-medium">Price</th>
                <th className="text-left px-5 py-3 font-medium">Stock</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-gray-300 font-medium truncate max-w-[200px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{p.category}</td>
                  <td className="px-5 py-3 text-gray-300 font-semibold">₹{p.price}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.inStock ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                      {p.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-yellow-400 transition"><FaEdit /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-red-400 transition"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Product" : "Add Product"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"><label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label><input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label><input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Original Price (₹)</label><input type="number" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Category</label><select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none"><option>Men</option><option>Women</option><option>Kids</option><option>Footwear</option><option>Accessories</option></select></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Stock Status</label><select value={formData.inStock} onChange={(e) => setFormData({ ...formData, inStock: e.target.value === "true" })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none"><option value="true">In Stock</option><option value="false">Out of Stock</option></select></div>
            <div className="sm:col-span-2"><label className="block text-sm font-semibold text-gray-700 mb-1">Description</label><textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none resize-none" /></div>
          </div>
          {/* Image upload placeholder */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
            <FaImage className="text-3xl text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Drag & drop product image or click to upload</p>
          </div>
          <button onClick={handleSave} className="w-full bg-black text-yellow-400 py-3 rounded-full font-bold hover:bg-gray-900 transition shadow-lg">
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </div>
      </Modal>
    </AdminLayout>
  );
}

export default ManageProducts;
