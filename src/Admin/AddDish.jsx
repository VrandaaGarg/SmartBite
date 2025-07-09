import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaPlusCircle,
  FaUtensils,
  FaRupeeSign,
  FaImage,
  FaArrowLeft,
  FaLeaf,
  FaDrumstickBite,
  FaInfoCircle,
} from "react-icons/fa";
import { useToast } from "../Context/ToastContext";
import { useNavigate } from "react-router-dom";
import { useData } from "../Context/DataContext";
import appwriteService from "../config/service";

const AddDish = () => {
  const [dish, setDish] = useState({
    Name: "",
    Description: "",
    Price: "",
    Image: "",
    MenuID: "",
    Type: "veg",
  });
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { refreshData } = useData();

  const menuCategories = useData().menus;

  const handleChange = (e) => {
    setDish({ ...dish, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      showToast("Adding dish...", "info");

      // Transform data to match Appwrite schema
      const dishData = {
        name: dish.Name,
        description: dish.Description,
        price: parseFloat(dish.Price),
        imgUrl: dish.Image,
        menuId: dish.MenuID,
        type: dish.Type,
        isAvailable: true,
      };

      await appwriteService.createDish(dishData);
      showToast("Dish added successfully!", "success");
      setDish({
        Name: "",
        Description: "",
        Price: "",
        Image: "",
        MenuID: "",
        Type: "veg",
      });
      refreshData(); // Refresh data in DataContext
    } catch (err) {
      console.error(err);
      showToast("Failed to add dish", "error");
    }
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-xl mt-6 mb-10 relative border border-gray-100"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-2 md:top-4 right-4 text-sm bg-red-500 hover:bg-red-600 text-white font-medium px-2 md:px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-2"
      >
        <FaArrowLeft /> <span className="hidden md:block">Back</span>
      </button>

      <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <FaPlusCircle className="text-red-600" />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-yellow-500">
          Add New Dish
        </span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700 flex items-center gap-1.5">
                Dish Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="Name"
                value={dish.Name}
                onChange={handleChange}
                required
                placeholder="e.g., Chicken Biryani"
                className="w-full border px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="Description"
                value={dish.Description}
                onChange={handleChange}
                rows={3}
                required
                className="w-full border px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition-all"
                placeholder="Describe the dish..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700 flex items-center gap-2">
                  <FaRupeeSign /> Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="Price"
                  value={dish.Price}
                  onChange={handleChange}
                  required
                  className="w-full border px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition-all"
                  placeholder="₹"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                  Dish Type
                </label>
                <select
                  name="Type"
                  value={dish.Type}
                  onChange={handleChange}
                  className="w-full border px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition-all"
                >
                  <option value="veg">🌱 Vegetarian</option>
                  <option value="nonVeg">🍗 Non-Vegetarian</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700 flex items-center gap-2">
                <FaUtensils /> Menu Category{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                name="MenuID"
                value={dish.MenuID}
                onChange={handleChange}
                required
                className="w-full border px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition-all"
              >
                <option value="">Select a category</option>
                {menuCategories.map((cat) => (
                  <option key={cat.MenuID} value={cat.MenuID}>
                    {`${cat.Icon} ${cat.Name}`}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500 italic">
                {dish.MenuID &&
                  menuCategories.find((cat) => cat.MenuID === dish.MenuID)
                    ?.Description}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700 flex items-center gap-2">
                <FaImage /> Image URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="Image"
                value={dish.Image}
                onChange={handleChange}
                required
                className="w-full border px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition-all"
                placeholder="https://example.com/image.jpg"
              />
              {dish.Image && (
                <div className="mt-3 relative">
                  <img
                    src={dish.Image}
                    alt="Dish preview"
                    className="w-full h-36 object-cover rounded-lg border shadow-sm"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=Invalid+Image+URL";
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          className="w-full mt-8 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold py-3 px-6 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
        >
          <FaPlusCircle /> Add Dish
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddDish;
