import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUserEdit,
  FaSave,
  FaSignOutAlt,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUserCircle,
} from "react-icons/fa";
import { useToast } from "../Context/ToastContext";

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    houseNo: user?.houseNo || "",
    street: user?.street || "",
    landmark: user?.landmark || "",
    city: user?.city || "",
    state: user?.state || "",
    pincode: user?.pincode || "",
  });

  const fullAddress = `${formData.houseNo}, ${formData.street}${
    formData.landmark ? ", " + formData.landmark : ""
  }, ${formData.city}, ${formData.state} - ${formData.pincode}`;

  const handleLogout = () => {
    logout();
    navigate("/login");
    showToast("Logged out successfully", "success");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    const updates = {
      Name: formData.name,
      Phone: formData.phone,
      HouseNo: formData.houseNo,
      Street: formData.street,
      Landmark: formData.landmark,
      City: formData.city,
      State: formData.state,
      Pincode: formData.pincode,
    };

    const result = await updateProfile(updates);
    if (result.success) {
      setIsEditing(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center mt-20 text-xl text-gray-600">
        No user found. Please log in.
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto p-8 md:my-10 bg-white rounded-2xl shadow-xl"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-yellow-400 text-red-700 flex items-center justify-center text-4xl font-bold shadow-inner">
          {user.Name?.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-3xl font-extrabold text-red-600 mt-4 flex items-center gap-2">
          <FaUserCircle /> My Profile
        </h2>
      </div>

      {/* Profile Form */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            name="name"
            value={formData.name}
            disabled={!isEditing}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${
              isEditing ? "bg-white" : "bg-gray-100 text-gray-500"
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-gray-500" />
            <input
              value={user.email}
              disabled
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-500 border"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <div className="flex items-center gap-2">
            <FaPhone className="text-gray-500" />
            <input
              name="phone"
              value={formData.phone}
              disabled={!isEditing}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isEditing ? "bg-white" : "bg-gray-100 text-gray-500"
              }`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          {isEditing ? (
            <div className="grid grid-cols-2 gap-4">
              {[
                "houseNo",
                "street",
                "landmark",
                "city",
                "state",
                "pincode",
              ].map((field, index) => (
                <input
                  key={index}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="px-4 py-2 rounded-lg border border-gray-300"
                />
              ))}
            </div>
          ) : (
            <textarea
              value={fullAddress}
              disabled
              rows="3"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-500 border"
            />
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex text-xs md:text-lg  flex-col-2 sm:flex-row justify-between items-center gap-4 mt-10">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 md:gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 md:px-6 py-2 rounded-lg shadow-sm"
          >
            <FaUserEdit /> Edit Profile
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 md:px-6 py-2 rounded-lg shadow-sm"
          >
            <FaSave /> Save Changes
          </button>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 md:px-6 py-2 rounded-lg shadow-sm"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </motion.div>
  );
};

export default Profile;
