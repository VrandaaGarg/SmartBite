import React from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="text-center mt-20 text-xl text-gray-600">
        No user found. Please log in.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded shadow text-center">
      {/* Profile Icon */}
      <div className="mx-auto w-20 h-20 flex items-center justify-center bg-yellow-400 text-red-700 text-3xl font-bold rounded-full mb-4">
        {user.name?.charAt(0).toUpperCase()}
      </div>

      <h2 className="text-3xl font-bold text-red-600 mb-6">My Profile</h2>

      <div className="space-y-4 text-lg text-left">
        <p><span className="font-semibold">Name:</span> {user.name}</p>
        <p><span className="font-semibold">Email:</span> {user.email}</p>
        <p><span className="font-semibold">Phone:</span> {user.phone}</p>
        <p><span className="font-semibold">Address:</span> {user.address}</p>
      </div>

      <button
        onClick={handleLogout}
        className="mt-8 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;