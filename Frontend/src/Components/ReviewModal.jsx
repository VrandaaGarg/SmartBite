import React, { useState, useEffect } from "react";
import { FaStar, FaTimes, FaRegSmile } from "react-icons/fa";
import { useOrder } from "../Context/OrderContext";
import { useToast } from "../Context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

const ReviewModal = ({ dishId, onClose, existingReview }) => {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refreshReviewInOrders } = useOrder();
  const { showToast } = useToast();

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.Rating);
      setComment(existingReview.Comment);
    }
  }, [existingReview]);

  const getRatingText = (rating) => {
    switch (rating) {
      case 1: return "Poor";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Very Good";
      case 5: return "Excellent";
      default: return "";
    }
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      showToast("Please add a comment to your review", "warning");
      return;
    }
    
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 h-screen bg-black/60 z-50 flex justify-center items-center px-4 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-red-600 transition-all p-2 rounded-full"
        >
          <FaTimes size={16} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            {existingReview ? "Edit Your Review" : "Share Your Experience"}
          </h3>
          <p className="text-gray-500 mt-1">
            {existingReview 
              ? "Update your feedback to help others" 
              : "Your feedback helps others make better choices"}
          </p>
        </div>

        {/* Star Rating */}
        <div className="mb-6">
          <label className="block mb-3 font-medium text-gray-700 text-center">How would you rate it?</label>
          <div className="flex items-center justify-center space-x-3 text-3xl mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                className="focus:outline-none"
              >
                <FaStar
                  className={`transition-all duration-200 ${
                    star <= (hoveredRating || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </motion.button>
            ))}
          </div>
          
          <AnimatePresence>
            {rating > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  rating >= 4 
                    ? "bg-green-100 text-green-700" 
                    : rating === 3 
                      ? "bg-yellow-100 text-yellow-700" 
                      : "bg-red-100 text-red-700"
                }`}>
                  {getRatingText(rating)}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">Your Review</label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-200 transition-all resize-none shadow-sm"
            placeholder="Tell us what you liked or didn't like about this dish..."
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {comment.length}/200 characters
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-gray-700 font-medium"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-5 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md"
            } transition-all`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FaRegSmile />
                <span>{existingReview ? "Update Review" : "Submit Review"}</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewModal;
