import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import { FaPlus, FaEdit, FaTrash, FaCheck, FaHome } from "react-icons/fa";

function AddressBook() {
  const [addresses, setAddresses] = useState([
    { id: 1, fullName: "Demo Customer", address: "123 Main Street, Pandit Chowk", city: "Meerut", state: "Uttar Pradesh", pincode: "250001", mobile: "8859000084", isDefault: true },
    { id: 2, fullName: "Demo Customer", address: "456 Park Road, Connaught Place", city: "New Delhi", state: "Delhi", pincode: "110001", mobile: "9999999999", isDefault: false },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ fullName: "", address: "", city: "", state: "", pincode: "", mobile: "", isDefault: false });

  const openAdd = () => {
    setEditingId(null);
    setFormData({ fullName: "", address: "", city: "", state: "", pincode: "", mobile: "", isDefault: false });
    setModalOpen(true);
  };

  const openEdit = (addr) => {
    setEditingId(addr.id);
    setFormData({ fullName: addr.fullName, address: addr.address, city: addr.city, state: addr.state, pincode: addr.pincode, mobile: addr.mobile, isDefault: addr.isDefault });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setAddresses(addresses.map((a) => (a.id === editingId ? { ...formData, id: editingId } : formData.isDefault ? { ...a, isDefault: false } : a)));
    } else {
      const newAddr = { ...formData, id: Date.now() };
      if (newAddr.isDefault) {
        setAddresses(addresses.map((a) => ({ ...a, isDefault: false })));
      }
      setAddresses([...addresses, newAddr]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const setDefault = (id) => {
    setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <>
      <Navbar />
      <PageHeader
        title="Address Book"
        subtitle="Manage your delivery addresses"
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Address Book" }]}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">{addresses.length} Saved Address{addresses.length !== 1 && "es"}</h2>
            <button onClick={openAdd} className="flex items-center gap-2 bg-black text-yellow-400 px-5 py-2.5 rounded-full font-semibold hover:bg-gray-900 transition-all shadow-lg text-sm">
              <FaPlus className="text-xs" /> Add New Address
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className={`bg-white rounded-2xl shadow-sm border p-6 ${addr.isDefault ? "border-yellow-400 ring-1 ring-yellow-200" : "border-gray-100"}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${addr.isDefault ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                      <FaHome className="text-xs" />
                    </div>
                    <span className="font-bold text-gray-900">{addr.fullName}</span>
                  </div>
                  {addr.isDefault && (
                    <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">Default</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-1">{addr.address}</p>
                <p className="text-gray-600 text-sm">{addr.city}, {addr.state} - {addr.pincode}</p>
                <p className="text-gray-500 text-sm mt-1">Phone: {addr.mobile}</p>

                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                  {!addr.isDefault && (
                    <button onClick={() => setDefault(addr.id)} className="flex items-center gap-1 text-sm text-yellow-600 font-semibold hover:text-yellow-700 transition">
                      <FaCheck className="text-xs" /> Set Default
                    </button>
                  )}
                  <button onClick={() => openEdit(addr)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-black transition">
                    <FaEdit className="text-xs" /> Edit
                  </button>
                  <button onClick={() => handleDelete(addr.id)} className="flex items-center gap-1 text-sm text-red-400 hover:text-red-600 transition">
                    <FaTrash className="text-xs" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Address" : "Add New Address"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
            <input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
              <input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
              <input value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Pincode</label>
              <input value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile</label>
              <input value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.isDefault} onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-yellow-500" />
            <span className="text-sm text-gray-600">Set as default address</span>
          </label>
          <button onClick={handleSave} className="w-full bg-black text-yellow-400 py-3 rounded-full font-bold hover:bg-gray-900 transition-all shadow-lg">
            {editingId ? "Update Address" : "Save Address"}
          </button>
        </div>
      </Modal>

      <Footer />
    </>
  );
}

export default AddressBook;
