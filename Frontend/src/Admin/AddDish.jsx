import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    FaPlusCircle, FaUtensils, FaRupeeSign, FaImage,
    FaArrowLeft, FaLeaf, FaDrumstickBite
} from "react-icons/fa";
import { useToast } from "../Context/ToastContext";
import { useNavigate } from "react-router-dom";

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
          const token = JSON.parse(localStorage.getItem("current_user"))?.token;
          const res = await fetch("http://localhost:5000/api/admin/dishes/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(dish),
          });
      
          const data = await res.json();
          if (res.ok) {
            showToast("Dish added successfully!", "success");
            setDish({ Name: "", Description: "", Price: "", Image: "", MenuID: "", Type: "veg" });
          } else {
            showToast(data.error || "Failed to add dish", "error");
          }
        } catch (err) {
          console.error(err);
          showToast("Server error", "error");
        }
      };
      

    return (
        <motion.div
            className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-xl mt-10 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >


            {/* 🔙 Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-4 right-4 text-sm bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg shadow"
            >
                <FaArrowLeft className="inline mr-1" /> Back
            </button>

            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FaPlusCircle className="text-red-600" />
                Add New Dish
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold mb-1">Dish Name</label>
                    <input
                        type="text"
                        name="Name"
                        value={dish.Name}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Chicken Biryani"
                        className="w-full border px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1">Description</label>
                    <textarea
                        name="Description"
                        value={dish.Description}
                        onChange={handleChange}
                        rows={3}
                        required
                        className="w-full border px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500"
                        placeholder="Describe the dish..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1 flex items-center gap-2">
                            <FaRupeeSign /> Price
                        </label>
                        <input
                            type="number"
                            name="Price"
                            value={dish.Price}
                            onChange={handleChange}
                            required
                            className="w-full border px-4 py-3 rounded-lg shadow-sm"
                            placeholder="₹"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1 flex items-center gap-2">
                            <FaUtensils /> Menu Category
                        </label>

                        <select
                            name="MenuID"
                            value={dish.MenuID}
                            onChange={handleChange}
                            required
                            className="w-full border px-4 py-3 rounded-lg shadow-sm"
                        >
                            <option value="">Select a category</option>
                            {menuCategories.map((cat) => (
                                <option key={cat.id} value={cat.id} >
                                    {`${cat.icon} ${cat.name} — ${cat.description}`}
                                </option>
                            ))}
                        </select>

                    </div>

                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1 flex items-center gap-2">
                        <FaImage /> Image URL
                    </label>
                    <input
                        type="text"
                        name="Image"
                        value={dish.Image}
                        onChange={handleChange}
                        required
                        className="w-full border px-4 py-3 rounded-lg shadow-sm"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1">Dish Type</label>
                    <select
                        name="Type"
                        value={dish.Type}
                        onChange={handleChange}
                        className="w-full border px-4 py-3 rounded-lg shadow-sm"
                    >
                        <option value="veg">🌱 Veg</option>
                        <option value="non-veg">🍗 Non-Veg</option>
                    </select>
                </div>

                <motion.button
                    type="submit"
                    whileTap={{ scale: 0.95 }}
                    className="w-full mt-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold py-3 px-6 rounded-lg shadow-md transition"
                >
                    Add Dish
                </motion.button>
            </form>
        </motion.div>
    );
};

export default AddDish;
