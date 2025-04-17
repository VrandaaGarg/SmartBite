import React, { useState, useEffect } from "react";
import { FaStar, FaTimes } from "react-icons/fa";
import { useOrder } from "../Context/OrderContext";
import { useToast } from "../Context/ToastContext";
import { motion } from "framer-motion";

const ReviewModal = ({ dishId, onClose, existingReview }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { refreshReviewInOrders } = useOrder();
  const { showToast } = useToast();

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.Rating);
      setComment(existingReview.Comment);
    }
  }, [existingReview]);

  const handleSubmit = async () => {
    const customerId = JSON.parse(localStorage.getItem("current_user"))?.CustomerID;

    const url = existingReview
      ? "http://localhost:5000/api/reviews/update"
      : "http://localhost:5000/api/reviews/add";

    const method = existingReview ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          DishID: dishId,
          CustomerID: customerId,
          Rating: rating,
          Comment: comment,
        }),
      });

      if (res.ok) {
        refreshReviewInOrders(dishId, {
          Rating: rating,
          Comment: comment,
          DishID: dishId,
          CustomerID: customerId,
          CreatedAt: new Date().toISOString(),
        });

        showToast(
          existingReview ? "Review updated successfully!" : "Review submitted successfully!",
          "success"
        );
        onClose();
      } else {
        showToast("Failed to submit review.", "error");
      }
    } catch (err) {
      console.error("Review error:", err);
      showToast("An error occurred while submitting the review.", "error");
    }
  };

  return (
    <div className="fixed inset-0 h-screen bg-black/50 z-50 flex justify-center items-center px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white p-6 rounded-xl w-full max-w-md shadow-xl"
      >
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition"
        >
          <FaTimes size={18} />
        </button>

        <h3 className="text-xl font-semibold mb-4">
          {existingReview ? "Edit Your Review" : "Leave a Review"}
        </h3>

        {/* ⭐ Star Rating */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Rating</label>
          <div className="flex items-center space-x-2 text-2xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="group focus:outline-none"
              >
                <FaStar
                  className={`transition-all duration-200 group-hover:scale-110 ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* 💬 Comment */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Comment</label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:ring-red-200"
            placeholder="What did you like or dislike?"
          />
        </div>

        {/* ✅ Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            {existingReview ? "Update" : "Submit"}
          </button>
        </div>

        {rating > 0 && (
          <p className="text-sm text-gray-500 mt-3">
            You rated this {rating} star{rating > 1 && "s"}.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default ReviewModal;
