import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    FaPlusCircle, FaUtensils, FaRupeeSign, FaImage,
    FaArrowLeft, FaLeaf, FaDrumstickBite, FaInfoCircle
} from "react-icons/fa";
import { useToast } from "../Context/ToastContext";
import { useNavigate } from "react-router-dom";

const AddDish = () => {
    const API_URL = import.meta.env.VITE_API_URL;
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
    const menuCategories = [
        { id: 1, name: "Starters", description: "Light and spicy appetizers", icon: "🍢" },
        { id: 2, name: "Main Course - Veg", description: "Indian vegetarian delights", icon: "🥬" },
        { id: 3, name: "Main Course - Non-Veg", description: "Flavorful meat curries", icon: "🍗" },
        { id: 4, name: "Biryani", description: "Layered masala rice dishes", icon: "🍛" },
        { id: 5, name: "Bread & Rice", description: "Sides to complete your meal", icon: "🥖" },
        { id: 6, name: "Beverages", description: "Cool drinks and refreshers", icon: "🥤" },
        { id: 7, name: "Desserts", description: "Sweet treats and endings", icon: "🍨" },
    ];

    const handleChange = (e) => {
        setDish({ ...dish, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          showToast("Adding dish...", "info"); // 🟡 Show adding loader toast immediately
      
          const token = JSON.parse(localStorage.getItem("current_user"))?.token;
          const res = await fetch(`${API_URL}/api/admin/dishes/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(dish),
          });
      
          const data = await res.json();
          if (res.ok) {
            showToast("Dish added successfully!", "success"); // 🟢 Success toast
            setDish({ Name: "", Description: "", Price: "", Image: "", MenuID: "", Type: "veg" });
          } else {
            showToast(data.error || "Failed to add dish", "error"); // 🔴 Error toast
          }
        } catch (err) {
          console.error(err);
          showToast("Server error", "error"); // 🔴 Server error toast
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
                                    <option value="non-veg">🍗 Non-Vegetarian</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold mb-1.5 text-gray-700 flex items-center gap-2">
                                <FaUtensils /> Menu Category <span className="text-red-500">*</span>
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
                                    <option key={cat.id} value={cat.id}>
                                        {`${cat.icon} ${cat.name}`}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-gray-500 italic">
                                {dish.MenuID && menuCategories.find(cat => cat.id === parseInt(dish.MenuID))?.description}
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
                                            e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
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
