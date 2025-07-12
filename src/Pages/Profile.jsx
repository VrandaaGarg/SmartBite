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
  FaKey,
  FaIdCard,
  FaClock,
  FaShieldAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaUser,
  FaHome,
  FaCity,
  FaMapPin,
} from "react-icons/fa";
import { useToast } from "../Context/ToastContext";

const Profile = () => {
  const { user, logout, updateProfile, resetPassword, sendEmailVerification } =
    useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [formData, setFormData] = useState({
    name: user?.name || user?.Name || "",
    phone: user?.phone || user?.Phone || "",
    houseNo: user?.houseNo || user?.HouseNo || "",
    street: user?.street || user?.Street || "",
    landmark: user?.landmark || user?.Landmark || "",
    city: user?.city || user?.City || "",
    state: user?.state || user?.State || "",
    pincode: user?.pincode || user?.Pincode || "",
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

  const handlePasswordReset = async () => {
    const result = await resetPassword(user.email);
    if (result.success) {
      setShowPasswordReset(false);
      showToast("Password reset email sent! Check your inbox.", "success");
    }
  };

  const handleEmailVerification = async () => {
    const result = await sendEmailVerification();
    // Toast is already shown in the context function
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAccountAge = () => {
    if (!user?.createdAt && !user?.$createdAt) return "Unknown";
    const createdDate = new Date(user.createdAt || user.$createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserCircle className="text-4xl text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            No user found
          </h2>
          <p className="text-gray-500">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: FaUserCircle },
    { id: "account", label: "Account Info", icon: FaIdCard },
    { id: "security", label: "Security", icon: FaShieldAlt },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-8 px-4">
      <motion.div
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-500 rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="relative">
              <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm flex items-center justify-center text-3xl md:text-6xl font-bold border-4 border-white/30">
                {(user.Name || user.name)?.charAt(0).toUpperCase()}
              </div>
              {user.emailVerification && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                  <FaCheckCircle className="text-white text-lg" />
                </div>
              )}
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl md:text-4xl font-bold mb-2">
                {user.Name || user.name}
              </h1>
              <p className="text-red-100 text-md md:text-lg mb-2">
                {user.email}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  Member for {getAccountAge()}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  {user.isAdmin ? "Administrator" : "Customer"}
                </span>
                <span
                  className={`px-3 py-1 rounded-full ${
                    user.emailVerification
                      ? "bg-green-500/80"
                      : "bg-yellow-500/80"
                  }`}
                >
                  {user.emailVerification ? "✓ Verified" : "⚠ Unverified"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-lg p-2 flex flex-wrap justify-center gap-2 md:gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base rounded-lg transition-all duration-300 font-medium ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md transform scale-105"
                      : "text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 hover:text-red-600 hover:bg-red-50"
                  }`}
                >
                  <Icon className="text-lg" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "profile" && (
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg md:text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <FaUser className="text-red-600" />
                  Personal Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 md:px-6 py-2 md:py-3 text-sm md:text-base rounded-xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <FaUserEdit /> Edit
                  </button>
                ) : (
                  <div className="flex flex-col md:flex-row gap-2 md:gap-3">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 md:px-6 py-2 md:py-3 text-sm md:text-base rounded-md md:rounded-xl shadow-lg transition-all"
                    >
                      <FaSave /> Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 md:px-6 py-2 md:py-3 text-sm md:text-base rounded-md md:rounded-xl shadow-lg transition-all"
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Details */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        name="name"
                        value={formData.name}
                        disabled={!isEditing}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 ${
                          isEditing
                            ? "bg-white border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                            : "bg-gray-50 border-gray-200 text-gray-600"
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        value={user.email}
                        disabled
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-600"
                        placeholder="your@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaPhone className="text-gray-400" />
                      </div>
                      <input
                        name="phone"
                        value={formData.phone}
                        disabled={!isEditing}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 ${
                          isEditing
                            ? "bg-white border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                            : "bg-gray-50 border-gray-200 text-gray-600"
                        }`}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-red-600" />
                    Address Information
                  </h3>

                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaHome className="text-gray-400" />
                        </div>
                        <input
                          name="houseNo"
                          value={formData.houseNo}
                          onChange={handleChange}
                          placeholder="House No."
                          className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all"
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaMapMarkerAlt className="text-gray-400" />
                        </div>
                        <input
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                          placeholder="Street"
                          className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all"
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaMapPin className="text-gray-400" />
                        </div>
                        <input
                          name="landmark"
                          value={formData.landmark}
                          onChange={handleChange}
                          placeholder="Landmark"
                          className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all"
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaCity className="text-gray-400" />
                        </div>
                        <input
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="City"
                          className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all"
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaMapMarkerAlt className="text-gray-400" />
                        </div>
                        <input
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="State"
                          className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all"
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaMapPin className="text-gray-400" />
                        </div>
                        <input
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          placeholder="Pincode"
                          className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border-2 border-red-200">
                      <textarea
                        value={fullAddress}
                        disabled
                        rows="4"
                        className="w-full bg-transparent text-gray-700 resize-none focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Logout Button */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-xl shadow-lg transition-all transform hover:scale-105"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          )}

          {/* Account Info */}

          {activeTab === "account" && (
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
              <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <FaIdCard className="text-red-600" />
                Account Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                <motion.div
                  className="bg-gradient-to-br from-red-50 to-red-100 p-4 md:p-6 rounded-xl border border-red-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-red-600 rounded-lg flex items-center justify-center">
                      <FaIdCard className="text-white" />
                    </div>
                    <span className="font-semibold text-gray-800">
                      Customer ID
                    </span>
                  </div>
                  <p className="text-gray-900 font-mono text-sm md:text-base bg-white p-3 rounded-lg border">
                    {user.CustomerID || user.$id || "Not available"}
                  </p>
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 md:p-6 rounded-xl border border-orange-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                      <FaCalendarAlt className="text-white" />
                    </div>
                    <span className="font-semibold text-gray-800">
                      Account Created
                    </span>
                  </div>
                  <p className="text-gray-900 text-sm md:text-base bg-white p-3 rounded-lg">
                    {formatDate(user.createdAt || user.$createdAt)}
                  </p>
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-6 rounded-xl border border-green-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <FaClock className="text-white" />
                    </div>
                    <span className="font-semibold text-gray-800">
                      Last Updated
                    </span>
                  </div>
                  <p className="text-gray-900 text-sm md:text-base bg-white p-3 rounded-lg">
                    {formatDate(user.$updatedAt)}
                  </p>
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 md:p-6 rounded-xl border border-yellow-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                      <FaClock className="text-white" />
                    </div>
                    <span className="font-semibold text-gray-800">
                      Last Accessed
                    </span>
                  </div>
                  <p className="text-gray-900 text-sm md:text-base bg-white p-3 rounded-lg">
                    {formatDate(user.accessedAt)}
                  </p>
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 md:p-6 rounded-xl border border-purple-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <FaShieldAlt className="text-white" />
                    </div>
                    <span className="font-semibold text-gray-800">
                      Account Type
                    </span>
                  </div>
                  <p className="text-gray-900 text-sm md:text-base bg-white p-3 rounded-lg font-medium">
                    {user.isAdmin ? "Administrator" : "Customer"}
                  </p>
                </motion.div>

                <motion.div
                  className={`bg-gradient-to-br p-4 md:p-6 rounded-xl border ${
                    user.emailVerification
                      ? "from-emerald-50 to-emerald-100 border-emerald-200"
                      : "from-amber-50 to-amber-100 border-amber-200"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center ${
                        user.emailVerification
                          ? "bg-emerald-600"
                          : "bg-amber-600"
                      }`}
                    >
                      {user.emailVerification ? (
                        <FaCheckCircle className="text-white" />
                      ) : (
                        <FaTimesCircle className="text-white" />
                      )}
                    </div>
                    <span className="font-semibold text-gray-800">
                      Email Verification
                    </span>
                  </div>
                  <p
                    className={`text-sm md:text-base font-semibold bg-white p-3 rounded-md md:rounded-lg ${
                      user.emailVerification
                        ? "text-emerald-700"
                        : "text-amber-700"
                    }`}
                  >
                    {user.emailVerification ? "✓ Verified" : "⚠ Not Verified"}
                  </p>
                </motion.div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
              <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <FaShieldAlt className="text-red-600" />
                Security Settings
              </h2>

              <div className="space-y-4 md:space-y-6">
                <motion.div
                  className="bg-gradient-to-r from-red-50 to-pink-50 p-4 md:p-8 rounded-xl border border-red-200"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                    <div>
                      <h3 className="text-md md:text-xl font-semibold text-gray-800 flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 md:w-12 md:h-12 bg-red-600 rounded-xl flex items-center justify-center">
                          <FaKey className="text-white text-md md:text-lg" />
                        </div>
                        Password Management
                      </h3>
                      <p className="text-gray-600">
                        Last updated: {formatDate(user.passwordUpdate)}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPasswordReset(true)}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 md:px-6 py-2 md:py-3 rounded-md md:rounded-xl text-sm md:text-base font-medium transition-all transform hover:scale-105 shadow-lg"
                    >
                      Reset Password
                    </button>
                  </div>
                  <div className="bg-white p-4 rounded-md md:rounded-lg">
                    <p className="text-sm md:text-base text-gray-600">
                      Keep your account secure by using a strong password and
                      updating it regularly.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 md:p-8 rounded-xl border border-orange-200"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                      <FaShieldAlt className="text-white text-md md:text-lg" />
                    </div>
                    <h3 className="text-md md:text-xl font-semibold text-gray-800">
                      Account Security
                    </h3>
                  </div>
                  <div className="space-y-4 md:space-y-6">
                    <div className="p-4 bg-white rounded-md md:rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-700 font-medium">
                          Email Verification:
                        </span>
                        <span
                          className={`px-3 py-1 md:px-4 md:py-2 rounded-md md:rounded-full text-sm md:text-base font-semibold ${
                            user.emailVerification
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.emailVerification
                            ? "✓ Verified"
                            : "✗ Not Verified"}
                        </span>
                      </div>
                      {!user.emailVerification && (
                        <div className="pt-3 border-t border-gray-100">
                          <button
                            onClick={handleEmailVerification}
                            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-4 py-2 rounded-md md:rounded-lg text-sm md:text-base font-medium transition-all transform shadow-md"
                          >
                            Send Verification Email
                          </button>
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            Check your email inbox for the verification link
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-md md:rounded-lg">
                      <span className="text-gray-700 font-medium">
                        Login Sessions:
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm md:text-base font-medium bg-green-100 text-green-700">
                        Active
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Password Reset Modal */}
        {showPasswordReset && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="bg-white p-4 md:p-8 rounded-2xl shadow-2xl max-w-md w-full"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaKey className="text-red-600" />
                  Reset Password
                </h3>
                <button
                  onClick={() => setShowPasswordReset(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-md md:rounded-lg hover:bg-gray-100 transition-all"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  We'll send a password reset link to your email address:
                </p>
                <div className="bg-red-50 border border-red-200 rounded-md md:rounded-lg p-4">
                  <strong className="text-red-900">{user.email}</strong>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePasswordReset}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2 md:py-3 px-4 md:px-6 rounded-md md:rounded-xl font-medium transition-all transform hover:scale-105"
                >
                  Send Reset Link
                </button>
                <button
                  onClick={() => setShowPasswordReset(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
