import React, { useEffect, useState } from "react";
import { FaStar, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const MenuModal = ({ dish, onClose }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/reviews/dish/${dish.DishID}`);
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    if (dish?.DishID) fetchReviews();
  }, [dish]);

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.Rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center px-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-white rounded-xl w-full max-w-xl h-[90vh] flex flex-col shadow-xl"
      >
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 text-gray-800 hover:text-red-600 transition"
        >
          <FaTimes size={18} />
        </button>

        {/* Image */}
        <div className="overflow-hidden rounded-xl flex-shrink-0">
          <img
            src={dish.Image}
            alt={dish.Name}
            className="w-full h-52 object-cover rounded-xl transition-transform duration-500 hover:scale-105 "
          />
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Dish Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{dish.Name}</h2>
            <p className="text-gray-600 mt-1">{dish.Description}</p>
            <p className="text-lg font-semibold text-red-600 mt-2">₹{dish.Price}</p>
          </div>

          {/* Average Rating */}
          {averageRating && (
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-700">Average Rating:</p>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`text-lg ${
                      star <= Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-1">({averageRating})</span>
            </div>
          )}

          {/* Recent Reviews */}
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-2">Recent Reviews</h3>
            {reviews.length > 0 ? (
              <ul className="space-y-2 max-h-48 overflow-auto pr-2 custom-scrollbar">
                {reviews.slice(0, 5).map((rev) => (
                  <li key={rev.ReviewID} className="border p-3 rounded-md bg-gray-50">
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`text-sm ${
                            star <= rev.Rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700">{rev.Comment}</p>
                    <p className="text-xs text-gray-400 mt-1">- {rev.CustomerName}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MenuModal;
