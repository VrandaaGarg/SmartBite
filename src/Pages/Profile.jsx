import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUserEdit, FaSave, FaSignOutAlt } from "react-icons/fa";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    localStorage.setItem("current_user", JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="text-center mt-20 text-xl text-gray-600">
        No user found. Please log in.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-md transition-all duration-300 ease-in-out">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-6 animate-fadeIn">
        <div className="w-24 h-24 rounded-full bg-yellow-400 text-red-700 flex items-center justify-center text-4xl font-bold shadow-inner">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-3xl font-bold text-red-600 mt-4">My Profile</h2>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
          <input
            name="name"
            value={formData.name}
            disabled={!isEditing}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded border ${
              isEditing ? "bg-white border-gray-300" : "bg-gray-100 text-gray-500"
            }`}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input
            value={user.email}
            disabled
            className="w-full px-4 py-2 rounded bg-gray-100 text-gray-500 border"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
          <input
            name="phone"
            value={formData.phone}
            disabled={!isEditing}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded border ${
              isEditing ? "bg-white border-gray-300" : "bg-gray-100 text-gray-500"
            }`}
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
          <textarea
            name="address"
            value={formData.address}
            disabled={!isEditing}
            onChange={handleChange}
            rows="3"
            className={`w-full px-4 py-2 rounded border ${
              isEditing ? "bg-white border-gray-300" : "bg-gray-100 text-gray-500"
            }`}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 animate-fadeIn">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded transition"
          >
            <FaUserEdit /> Edit Profile
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition"
          >
            <FaSave /> Save Changes
          </button>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;