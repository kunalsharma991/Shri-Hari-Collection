import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import {
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeart, FaBox,
  FaSignOutAlt, FaEdit, FaCheck, FaTimes, FaLock, FaKey,
} from "react-icons/fa";

function Profile() {
  const { user, updateProfile, changePassword, logout } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [editData, setEditData] = useState({ ...user });
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmNew: "" });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSaveProfile = () => {
    updateProfile({
      fullName: editData.fullName,
      email: editData.email,
      mobile: editData.mobile,
    });
    setEditMode(false);
    setSuccessMsg("Profile updated successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmNew) {
      setErrorMsg("New passwords do not match.");
      return;
    }
    const result = changePassword(passwordData.oldPassword, passwordData.newPassword);
    if (result.success) {
      setShowPasswordForm(false);
      setPasswordData({ oldPassword: "", newPassword: "", confirmNew: "" });
      setSuccessMsg("Password changed successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      setErrorMsg(result.message);
    }
    setTimeout(() => setErrorMsg(""), 3000);
  };

  // Sidebar menu items
  const menuItems = [
    { icon: FaUser, label: "Profile", active: true },
    { icon: FaBox, label: "My Orders", to: "/my-orders" },
    { icon: FaMapMarkerAlt, label: "Address Book", to: "/address-book" },
    { icon: FaHeart, label: "Wishlist", to: "/wishlist" },
  ];

  return (
    <>
      <Navbar />
      <PageHeader
        title="My Account"
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "My Account" }]}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

          {/* Flash Messages */}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
              <FaCheck className="text-green-500" /> {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* ─── Sidebar ─── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                {/* User Avatar */}
                <div className="text-center mb-6 pb-6 border-b border-gray-100">
                  <div className="w-20 h-20 rounded-full bg-yellow-500 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-black">
                      {user?.fullName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900">{user?.fullName}</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>

                {/* Menu */}
                <nav className="space-y-1">
                  {menuItems.map((item) =>
                    item.active ? (
                      <div key={item.label} className="flex items-center gap-3 px-4 py-3 bg-yellow-50 text-yellow-700 rounded-xl font-semibold">
                        <item.icon className="text-sm" /> {item.label}
                      </div>
                    ) : (
                      <Link key={item.label} to={item.to} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition">
                        <item.icon className="text-sm" /> {item.label}
                      </Link>
                    )
                  )}
                  <button
                    onClick={() => { logout(); window.location.href = "/"; }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition mt-4"
                  >
                    <FaSignOutAlt className="text-sm" /> Logout
                  </button>
                </nav>
              </div>
            </div>

            {/* ─── Main Content ─── */}
            <div className="lg:col-span-3 space-y-6">

              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                  {!editMode ? (
                    <button onClick={() => { setEditMode(true); setEditData({ ...user }); }} className="flex items-center gap-2 text-yellow-600 font-semibold hover:text-yellow-700 transition">
                      <FaEdit className="text-sm" /> Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={handleSaveProfile} className="flex items-center gap-1.5 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition">
                        <FaCheck className="text-xs" /> Save
                      </button>
                      <button onClick={() => setEditMode(false)} className="flex items-center gap-1.5 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition">
                        <FaTimes className="text-xs" /> Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Full Name</label>
                    {editMode ? (
                      <input value={editData.fullName || ""} onChange={(e) => setEditData({ ...editData, fullName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none" />
                    ) : (
                      <p className="font-semibold text-gray-900 flex items-center gap-2"><FaUser className="text-gray-400 text-sm" /> {user?.fullName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Email</label>
                    {editMode ? (
                      <input value={editData.email || ""} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none" />
                    ) : (
                      <p className="font-semibold text-gray-900 flex items-center gap-2"><FaEnvelope className="text-gray-400 text-sm" /> {user?.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Mobile</label>
                    {editMode ? (
                      <input value={editData.mobile || ""} onChange={(e) => setEditData({ ...editData, mobile: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none" />
                    ) : (
                      <p className="font-semibold text-gray-900 flex items-center gap-2"><FaPhone className="text-gray-400 text-sm" /> {user?.mobile}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Role</label>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      <FaKey className="text-gray-400 text-sm" /> {user?.role === "admin" ? "Administrator" : "Customer"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Change Password Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaLock className="text-yellow-500" /> Change Password
                  </h2>
                  {!showPasswordForm && (
                    <button onClick={() => setShowPasswordForm(true)} className="text-yellow-600 font-semibold hover:text-yellow-700 transition">
                      Change
                    </button>
                  )}
                </div>

                {showPasswordForm ? (
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Current Password</label>
                      <input type="password" value={passwordData.oldPassword} onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">New Password</label>
                      <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Confirm New Password</label>
                      <input type="password" value={passwordData.confirmNew} onChange={(e) => setPasswordData({ ...passwordData, confirmNew: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-yellow-500 focus:outline-none" />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={handleChangePassword} className="bg-black text-yellow-400 px-6 py-2.5 rounded-full font-semibold hover:bg-gray-900 transition">Save Password</button>
                      <button onClick={() => { setShowPasswordForm(false); setPasswordData({ oldPassword: "", newPassword: "", confirmNew: "" }); }} className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-full font-semibold hover:bg-gray-300 transition">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Keep your account secure with a strong password.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profile;
