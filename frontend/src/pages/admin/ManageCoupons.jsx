import { useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import Modal from "../../components/Modal";
import couponsData from "../../data/coupons";
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";

function ManageCoupons() {
  const [coupons, setCoupons] = useState(couponsData);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ code: "", discount: "", type: "percentage", expiryDate: "", maxUsage: "" });

  const openAdd = () => { setEditingId(null); setFormData({ code: "", discount: "", type: "percentage", expiryDate: "", maxUsage: "" }); setModalOpen(true); };
  const openEdit = (c) => { setEditingId(c.id); setFormData({ code: c.code, discount: c.discount, type: c.type, expiryDate: c.expiryDate, maxUsage: c.maxUsage }); setModalOpen(true); };

  const handleSave = () => {
    if (editingId) {
      setCoupons(coupons.map((c) => c.id === editingId ? { ...c, ...formData, discount: Number(formData.discount), maxUsage: Number(formData.maxUsage) } : c));
    } else {
      setCoupons([...coupons, { ...formData, id: Date.now(), discount: Number(formData.discount), maxUsage: Number(formData.maxUsage), isActive: true, usageCount: 0 }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => { setCoupons(coupons.filter((c) => c.id !== id)); };
  const toggleActive = (id) => { setCoupons(coupons.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c)); };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Coupons</h1>
        <button onClick={openAdd} className="flex items-center justify-center gap-2 bg-yellow-500 text-black px-5 py-2.5 rounded-lg font-semibold hover:bg-yellow-400 transition text-sm">
          <FaPlus className="text-xs" /> Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div key={coupon.id} className={`bg-gray-900 rounded-xl border p-5 ${coupon.isActive ? "border-gray-800" : "border-gray-800/50 opacity-60"}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-yellow-400 font-mono tracking-wider">{coupon.code}</span>
              <button onClick={() => toggleActive(coupon.id)} className={`transition ${coupon.isActive ? "text-green-400" : "text-gray-600"}`}>
                {coupon.isActive ? <FaToggleOn className="text-xl" /> : <FaToggleOff className="text-xl" />}
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Discount</span>
                <span className="text-gray-300 font-semibold">{coupon.type === "percentage" ? `${coupon.discount}%` : `₹${coupon.discount}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Usage</span>
                <span className="text-gray-300">{coupon.usageCount}/{coupon.maxUsage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Expires</span>
                <span className="text-gray-300">{new Date(coupon.expiryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-800">
              <button onClick={() => openEdit(coupon)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-yellow-400 transition"><FaEdit /> Edit</button>
              <button onClick={() => handleDelete(coupon.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition ml-auto"><FaTrash /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Coupon" : "Create Coupon"}>
        <div className="space-y-4">
          <div><label className="block text-sm font-semibold text-gray-700 mb-1">Coupon Code</label><input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="e.g. SUMMER20" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none font-mono uppercase" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Discount Value</label><input type="number" value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Type</label><select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none"><option value="percentage">Percentage (%)</option><option value="flat">Flat Amount (₹)</option></select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Expiry Date</label><input type="date" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Max Usage</label><input type="number" value={formData.maxUsage} onChange={(e) => setFormData({ ...formData, maxUsage: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none" /></div>
          </div>
          <button onClick={handleSave} className="w-full bg-black text-yellow-400 py-3 rounded-full font-bold hover:bg-gray-900 transition shadow-lg">
            {editingId ? "Update Coupon" : "Create Coupon"}
          </button>
        </div>
      </Modal>
    </AdminLayout>
  );
}

export default ManageCoupons;
