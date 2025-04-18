import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { motion } from "framer-motion";
import { useToast } from "../Context/ToastContext";
import { useNavigate } from "react-router-dom";

const ManageDishes = () => {
  const [dishes, setDishes] = useState([]);
  const [editingDish, setEditingDish] = useState(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/dishes", {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("current_user"))?.token}`,
        },
      });
      const data = await res.json();
      setDishes(data);
    } catch (err) {
      console.error("Error fetching dishes:", err);
      showToast("Failed to fetch dishes", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this dish?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/dishes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("current_user"))?.token}`,
        },
      });

      if (res.ok) {
        showToast("Dish deleted successfully", "success");
        fetchDishes();
      } else {
        showToast("Failed to delete dish", "error");
      }
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Error deleting dish", "error");
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/dishes/${editingDish.DishID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("current_user"))?.token}`,
        },
        body: JSON.stringify(editingDish),
      });

      if (res.ok) {
        showToast("Dish updated successfully", "success");
        setEditingDish(null);
        fetchDishes();
      } else {
        showToast("Failed to update dish", "error");
      }
    } catch (err) {
      console.error("Update error:", err);
      showToast("Error updating dish", "error");
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="absolute right-0 flex items-center gap-2 px-4 py-2 text-white bg-red-500 hover:bg-red-600 transition rounded-lg"
        >
          <IoArrowBack size={20} /> Back
        </button>
      </div>

      <h1 className="text-4xl font-extrabold text-red-600 mb-6 text-center tracking-tight">Manage Dishes</h1>

      <div className="overflow-x-auto shadow-xl">
        <table className="min-w-full bg-white text-sm border">
          <thead className="bg-yellow-100 text-red-700">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Menu ID</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dishes.map((dish, idx) => (
              <motion.tr
                key={dish.DishID}
                className="border-t hover:bg-gray-100 transition"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <td className="px-4 py-2">
                  <img src={dish.Image} alt={dish.Name} className="w-16 h-16 object-cover rounded-lg shadow" />
                </td>
                <td className="px-4 py-2 font-semibold text-gray-800">{dish.Name}</td>
                <td className="px-4 py-2 capitalize text-gray-600">{dish.Type}</td>
                <td className="px-4 py-2 text-red-600 font-bold">₹{dish.Price}</td>
                <td className="px-4 py-2">{dish.MenuID}</td>
                <td className="px-4 py-2 text-center flex justify-center items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => setEditingDish(dish)}
                  >
                    <FaEdit size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(dish.DishID)}
                  >
                    <FaTrashAlt size={18} />
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      
      {/* Edit Modal */}
     
      {editingDish && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center px-4">
          <motion.div
            className="bg-white rounded-2xl p-8 w-full max-w-xl shadow-2xl border border-red-100 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-4xl font-bold"
              onClick={() => setEditingDish(null)}
              aria-label="Close"
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold text-red-600 mb-2 text-center">Edit Dish Details</h2>
            <p className="text-gray-600 text-sm mb-6 text-center">Update your menu with accurate and up-to-date information</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dish Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                  value={editingDish.Name}
                  onChange={(e) => setEditingDish({ ...editingDish, Name: e.target.value })}
                  placeholder="Dish Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                  rows={2}
                  value={editingDish.Description}
                  onChange={(e) => setEditingDish({ ...editingDish, Description: e.target.value })}
                  placeholder="Short description of the dish"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                    value={editingDish.Price}
                    onChange={(e) => setEditingDish({ ...editingDish, Price: e.target.value })}
                    placeholder="Price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                    value={editingDish.Type}
                    onChange={(e) => setEditingDish({ ...editingDish, Type: e.target.value })}
                  >
                    <option value="veg">Veg</option>
                    <option value="non-veg">Non-Veg</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                  value={editingDish.Image}
                  onChange={(e) => setEditingDish({ ...editingDish, Image: e.target.value })}
                  placeholder="Paste image URL here"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setEditingDish(null)}
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}


    </motion.div>
  );
};

export default ManageDishes;