import { useState } from "react";
import {
  FaStar,
  FaTimes,
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaSync,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useCart } from "../Context/CartContext";
import { useReview } from "../Context/ReviewContext";
import { useAuth } from "../Context/AuthContext";
import ReviewModal from "./ReviewModal";

const MenuModal = ({ dish, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const { cart, addToCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const {
    getReviewsForDishId,
    getAverageRating,
    deleteReview,
    getExistingReview,
    fetchReviews: refreshReviews,
  } = useReview();

  // Get reviews for current dish
  const reviews = dish?.DishID ? getReviewsForDishId(dish.DishID) : [];
  const averageRating = dish?.DishID ? getAverageRating(dish.DishID) : null;

  // Handle review actions
  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewModal(true);
  };

  const handleDeleteReview = async (review) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await deleteReview(review.DishID, review.CustomerID);
    }
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setEditingReview(null);
  };

  const handleAddToCart = async () => {
    const existingItem = cart.find((item) => item.DishID === dish.DishID);

    if (existingItem) {
      // Already in cart → Update Quantity
      await updateQuantity(dish.DishID, existingItem.quantity + quantity);
    } else {
      // Not in cart → Add to Cart
      await addToCart({ ...dish, quantity });
    }

    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
    }, 1500);
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-white rounded-xl sm:rounded-2xl w-full max-w-xl max-h-[70vh] md:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 bg-white/80 rounded-full p-1.5 sm:p-2 text-gray-800 hover:text-red-600 hover:bg-white transition-all shadow-md"
        >
          <FaTimes size={16} className="sm:text-lg" />
        </button>

        {/* Image */}
        <div className="overflow-hidden flex-shrink-0 relative h-40 sm:h-56">
          <img
            src={dish.Image}
            alt={dish.Name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {averageRating && (
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-white/90 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-lg flex items-center gap-1 text-sm sm:text-base">
              <FaStar className="text-yellow-500" />
              <span className="font-medium">{averageRating}</span>
              <span className="text-xs text-gray-500">({reviews.length})</span>
            </div>
          )}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium shadow-lg">
            ₹{dish.Price}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1 custom-scrollbar">
          {/* Dish Info */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              {dish.Name}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 leading-relaxed">
              {dish.Description}
            </p>
          </div>

          {/* Nutritional Info (Mock Data) */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-100">
            <h3 className="text-sm sm:text-md font-semibold text-gray-800 mb-2 sm:mb-3">
              Nutritional Information
            </h3>
            <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Calories:</span>
                <span className="font-medium">320 kcal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Protein:</span>
                <span className="font-medium">15g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Carbs:</span>
                <span className="font-medium">42g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fat:</span>
                <span className="font-medium">10g</span>
              </div>
            </div>
          </div>

          {/* Add to Cart Section */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center">
                <button
                  onClick={decrementQuantity}
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white rounded-l-lg border border-gray-200 hover:bg-gray-100 transition"
                >
                  <FaMinus size={10} className="sm:text-xs" />
                </button>
                <div className="w-10 h-8 sm:w-12 sm:h-10 flex items-center justify-center border-t border-b border-gray-200 bg-white font-medium text-sm sm:text-base">
                  {quantity}
                </div>
                <button
                  onClick={incrementQuantity}
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white rounded-r-lg border border-gray-200 hover:bg-gray-100 transition"
                >
                  <FaPlus size={10} className="sm:text-xs" />
                </button>
              </div>

              <motion.button
                onClick={handleAddToCart}
                whileTap={{ scale: 0.95 }}
                className={`w-full sm:flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-md sm:rounded-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2 shadow-md transition-all ${
                  addedToCart
                    ? "bg-green-600 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
                disabled={addedToCart}
              >
                <FaShoppingCart className="text-xs sm:text-sm" />
                <span className="truncate">
                  {addedToCart
                    ? "Added to Cart!"
                    : `Add to Cart - ₹${(dish.Price * quantity).toFixed(2)}`}
                </span>
              </motion.button>
            </div>
          </div>

          {/* Recent Reviews */}
          <div>
            <div className="flex justify-between items-center mb-2 sm:mb-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                Customer Reviews {reviews.length > 0 && `(${reviews.length})`}
              </h3>
              <div className="flex items-center gap-2">
                {user && (
                  <button
                    onClick={() => {
                      const existingReview = getExistingReview(dish.DishID);
                      setEditingReview(existingReview);
                      setShowReviewModal(true);
                    }}
                    className="text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-md font-medium transition-colors"
                  >
                    {getExistingReview(dish.DishID)
                      ? "Edit Review"
                      : "Add Review"}
                  </button>
                )}
                <button
                  onClick={refreshReviews}
                  className="text-gray-500 hover:text-red-600 transition-colors p-1"
                  title="Refresh reviews"
                >
                  <FaSync size={12} />
                </button>
                {reviews.length > 5 && (
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    {showAllReviews ? "Show Less" : "View All"}
                  </button>
                )}
              </div>
            </div>
            {reviews.length > 0 ? (
              <div className="space-y-2 sm:space-y-3 max-h-36 sm:max-h-48 overflow-auto pr-2 custom-scrollbar">
                {(showAllReviews ? reviews : reviews.slice(0, 5)).map((rev) => {
                  const reviewDate = new Date(rev.CreatedAt).toLocaleString(
                    "en-IN",
                    {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }
                  );

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={rev.ReviewID}
                      className="border p-3 sm:p-4 rounded-md sm:rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-1 mb-1 sm:mb-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={`text-xs sm:text-sm ${
                                star <= rev.Rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] sm:text-xs text-gray-500">
                            {reviewDate}
                          </span>
                          {user &&
                            (user.CustomerID == rev.CustomerID ||
                              user.$id == rev.CustomerID ||
                              user.$id == rev.userId) && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleEditReview(rev)}
                                  className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                                  title="Edit review"
                                >
                                  <FaEdit size={10} />
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(rev)}
                                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                                  title="Delete review"
                                >
                                  <FaTrash size={10} />
                                </button>
                              </div>
                            )}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        {rev.Comment}
                      </p>

                      <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 font-medium">
                        - {rev.CustomerName}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-50 p-3 sm:p-4 rounded-md sm:rounded-lg border border-gray-100 text-center">
                <p className="text-xs sm:text-sm text-gray-500">
                  No reviews yet. Be the first to review!
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          dishId={dish.DishID}
          onClose={handleCloseReviewModal}
          existingReview={editingReview}
        />
      )}
    </div>
  );
};

export default MenuModal;
