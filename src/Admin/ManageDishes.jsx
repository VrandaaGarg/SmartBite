import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaEdit, FaSearch, FaUtensils } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../Context/ToastContext";
import { useNavigate } from "react-router-dom";
import { useData } from "../Context/DataContext";
import appwriteService from "../config/service";

const ManageDishes = () => {
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [editingDish, setEditingDish] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Use DataContext for dishes
  const { dishes, refreshData } = useData();

  useEffect(() => {
    if (searchTerm) {
      const filtered = dishes.filter((dish) =>
        dish.Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDishes(filtered);
    } else {
      setFilteredDishes(dishes);
    }
  }, [searchTerm, dishes]);

  const handleDelete = async (id) => {
    setDeletingId(null); // Reset after confirmation
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this dish?"
    );
    if (!confirmDelete) return;

    try {
      await appwriteService.deleteDish(id);
      showToast("Dish deleted successfully", "success");
      refreshData(); // Refresh data from DataContext
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Error deleting dish", "error");
    }
  };

  const handleUpdate = async () => {
    try {
      // Transform data to match Appwrite schema
      const updateData = {
        name: editingDish.Name,
        description: editingDish.Description,
        price: editingDish.Price,
        imgUrl: editingDish.Image,
        type: editingDish.Type,
        isAvailable: editingDish.IsAvailable,
      };

      await appwriteService.updateDish(editingDish.DishID, updateData);
      showToast("Dish updated successfully", "success");
      setEditingDish(null);
      refreshData(); // Refresh data from DataContext
    } catch (err) {
      console.error("Update error:", err);
      showToast("Error updating dish", "error");
    }
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto p-5 md:p-8 relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-2 md:top-4 right-4 text-sm bg-red-500 hover:bg-red-600 text-white font-medium px-2 md:px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-2"
        >
          <IoArrowBack /> <span className="hidden md:block">Back</span>
        </button>
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-yellow-500 mb-8 text-center tracking-tight flex items-center justify-center gap-3">
        <FaUtensils className="text-red-500" /> Manage Dishes
      </h1>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <div className="flex items-center gap-2 px-4 py-3 border rounded-full bg-white shadow-sm transition-all w-full max-w-md focus-within:shadow-md focus-within:ring-2 focus-within:ring-red-400">
          <FaSearch className="text-red-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search dishes by name..."
            className="outline-none text-sm w-full bg-transparent"
          />
        </div>
      </div>

      {filteredDishes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <FaUtensils className="text-6xl mb-4 text-gray-300" />
          <p className="text-center text-lg">
            {searchTerm ? "No dishes match your search" : "No dishes available"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto hidden md:block shadow-xl rounded-xl border border-gray-200">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800">
              <tr>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDishes.map((dish, idx) => (
                <motion.tr
                  key={dish.DishID}
                  className="hover:bg-gray-50 transition"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ backgroundColor: "rgba(253, 230, 138, 0.1)" }}
                >
                  <td className="px-4 py-3">
                    <img
                      src={dish.Image}
                      alt={dish.Name}
                      className="w-16 h-16 object-cover rounded-lg shadow-sm"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/400x300?text=Image+Error";
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {dish.Name}
                  </td>
                  <td className="px-4 py-3 capitalize">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        dish.Type === "veg"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {dish.Type === "veg" ? "🌱 Veg" : "🍗 Non-Veg"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-red-600 font-bold text-right">
                    ₹{dish.Price}
                  </td>
                  <td className="px-4 py-3 text-center flex justify-center items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      className="text-blue-600 hover:text-blue-800 bg-blue-100 p-2 rounded-full"
                      onClick={() => setEditingDish(dish)}
                      title="Edit dish"
                    >
                      <FaEdit size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      className="text-red-600 hover:text-red-800 bg-red-100 p-2 rounded-full"
                      onClick={() => setDeletingId(dish.DishID)}
                      title="Delete dish"
                    >
                      <FaTrashAlt size={16} />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile View for smaller screens */}
      <div className="md:hidden mt-4 space-y-4">
        {filteredDishes.map((dish, idx) => (
          <motion.div
            key={dish.DishID}
            className="border rounded-lg shadow-sm p-4 bg-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <img
                src={dish.Image}
                alt={dish.Name}
                className="w-14 h-14 object-cover rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/400x300?text=Image+Error";
                }}
              />
              <div>
                <h3 className="font-semibold text-gray-800">{dish.Name}</h3>
                <p className="text-red-600 font-bold">₹{dish.Price}</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  dish.Type === "veg"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {dish.Type === "veg" ? "🌱 Veg" : "🍗 Non-Veg"}
              </span>
              <div className="flex gap-2">
                <button
                  className="bg-blue-100 text-blue-600 p-2 rounded-full"
                  onClick={() => setEditingDish(dish)}
                >
                  <FaEdit size={16} />
                </button>
                <button
                  className="bg-red-100 text-red-600 p-2 rounded-full"
                  onClick={() => setDeletingId(dish.DishID)}
                >
                  <FaTrashAlt size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingDish && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center px-4 py-8 overflow-y-auto">
            <motion.div
              className="bg-white rounded-2xl p-4 md:p-8 w-full max-w-xl shadow-2xl border border-red-100 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 bg-gray-100 hover:bg-red-50 rounded-full h-8 w-8 flex items-center justify-center transition-colors"
                onClick={() => setEditingDish(null)}
                aria-label="Close"
              >
                ×
              </button>

              <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
                Edit Dish Details
              </h2>
              <p className="text-gray-600 hidden md:block text-sm mb-6">
                Update your menu with accurate and up-to-date information
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dish Name
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                      value={editingDish.Name}
                      onChange={(e) =>
                        setEditingDish({ ...editingDish, Name: e.target.value })
                      }
                      placeholder="Dish Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                      rows={3}
                      value={editingDish.Description}
                      onChange={(e) =>
                        setEditingDish({
                          ...editingDish,
                          Description: e.target.value,
                        })
                      }
                      placeholder="Short description of the dish"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                        value={editingDish.Price}
                        onChange={(e) =>
                          setEditingDish({
                            ...editingDish,
                            Price: e.target.value,
                          })
                        }
                        placeholder="Price"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                        value={editingDish.Type}
                        onChange={(e) =>
                          setEditingDish({
                            ...editingDish,
                            Type: e.target.value,
                          })
                        }
                      >
                        <option value="veg">🌱 Veg</option>
                        <option value="non-veg">🍗 Non-Veg</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                      value={editingDish.Image}
                      onChange={(e) =>
                        setEditingDish({
                          ...editingDish,
                          Image: e.target.value,
                        })
                      }
                      placeholder="Paste image URL here"
                    />
                  </div>

                  {/* Image Preview */}
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-2">Image Preview:</p>
                    <img
                      src={editingDish.Image}
                      alt={editingDish.Name}
                      className="w-full h-24 md:h-40 object-cover rounded-lg border shadow-sm"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/400x300?text=Invalid+Image+URL";
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setEditingDish(null)}
                  className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center px-4">
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border border-red-100"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Delete Dish
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this dish? This action cannot be
                undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeletingId(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deletingId)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ManageDishes;
