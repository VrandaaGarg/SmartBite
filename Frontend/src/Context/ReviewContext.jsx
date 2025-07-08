import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import appwriteService from "../config/service";

const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all reviews from Appwrite and enrich with customer names
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const reviewData = await appwriteService.getReviews();
      const users = await appwriteService.getAllUsers();

      // Enrich reviews with customer names and transform data
      const enrichedReviews = reviewData.map((review) => {
        const customer = users.find((user) => user.$id === review.userId);
        return {
          ...review,
          ReviewID: review.$id,
          DishID: review.dishId,
          CustomerID: review.userId,
          Rating: review.rating,
          Comment: review.comment,
          CreatedAt: review.createdAt,
          CustomerName: customer
            ? customer.name || customer.Name
            : "Anonymous User",
        };
      });

      setReviews(enrichedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      showToast("Error loading reviews", "error");
      setReviews([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Get reviews for a specific dish
  const getReviewsForDishId = useCallback(
    (dishId) => {
      return reviews
        .filter((review) => {
          // Handle both string and integer comparisons
          return review.DishID == dishId || review.dishId == dishId;
        })
        .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
    },
    [reviews]
  );

  // Get reviews by customer
  const getCustomerReviews = useCallback(
    (customerId) => {
      return reviews
        .filter(
          (review) =>
            review.CustomerID == customerId || review.userId == customerId
        )
        .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
    },
    [reviews]
  );

  // Add or update a review
  const saveReview = useCallback(
    async (reviewData) => {
      if (!user?.$id) {
        showToast("Please login to submit review", "error");
        return null;
      }

      try {
        // Check if review already exists for this user and dish
        const existingReviews = await appwriteService.getReviewsByUser(
          user.$id
        );
        const existingReview = existingReviews.find(
          (review) => review.dishId == reviewData.DishID
        );

        const reviewPayload = {
          dishId: reviewData.DishID,
          userId: user.$id,
          rating: reviewData.Rating,
          comment: reviewData.Comment,
        };

        let savedReview;
        let isUpdate = false;

        if (existingReview) {
          // Update existing review
          savedReview = await appwriteService.updateReview(
            existingReview.$id,
            reviewPayload
          );
          isUpdate = true;
        } else {
          // Create new review
          savedReview = await appwriteService.createReview(reviewPayload);
        }

        // Transform the saved review to match expected format
        const enrichedReview = {
          ...savedReview,
          ReviewID: savedReview.$id,
          DishID: savedReview.dishId,
          CustomerID: savedReview.userId,
          Rating: savedReview.rating,
          Comment: savedReview.comment,
          CreatedAt: savedReview.createdAt,
          CustomerName: user.name || user.Name || "Anonymous User",
        };

        // Update local state
        if (isUpdate) {
          setReviews((prev) =>
            prev.map((review) =>
              (review.DishID == reviewData.DishID ||
                review.dishId == reviewData.DishID) &&
              (review.CustomerID == user.$id || review.userId == user.$id)
                ? enrichedReview
                : review
            )
          );
        } else {
          setReviews((prev) => [enrichedReview, ...prev]);
        }

        showToast(
          isUpdate
            ? "Review updated successfully!"
            : "Review submitted successfully!",
          "success"
        );

        return enrichedReview;
      } catch (error) {
        console.error("Error saving review:", error);
        showToast("Failed to save review", "error");
        return null;
      }
    },
    [user, showToast]
  );

  // Delete a review
  const deleteReview = useCallback(
    async (dishId, customerId = null) => {
      const targetCustomerId = customerId || user?.$id;

      if (!targetCustomerId) {
        showToast("Unable to delete review", "error");
        return false;
      }

      try {
        // Find the review to delete
        const reviewToDelete = reviews.find(
          (review) =>
            (review.DishID == dishId || review.dishId == dishId) &&
            (review.CustomerID == targetCustomerId ||
              review.userId == targetCustomerId)
        );

        if (!reviewToDelete) {
          showToast("Review not found", "error");
          return false;
        }

        // Delete from Appwrite
        await appwriteService.deleteReview(reviewToDelete.ReviewID);

        // Update local state
        setReviews((prev) =>
          prev.filter(
            (review) =>
              !(
                (review.DishID == dishId || review.dishId == dishId) &&
                (review.CustomerID == targetCustomerId ||
                  review.userId == targetCustomerId)
              )
          )
        );

        showToast("Review deleted successfully!", "success");
        return true;
      } catch (error) {
        console.error("Error deleting review:", error);
        showToast("Failed to delete review", "error");
        return false;
      }
    },
    [user, showToast, reviews]
  );

  // Get existing review for a dish by current user
  const getExistingReview = useCallback(
    (dishId) => {
      if (!user?.$id) return null;

      return (
        reviews.find(
          (review) =>
            (review.DishID == dishId || review.dishId == dishId) &&
            (review.CustomerID == user.$id || review.userId == user.$id)
        ) || null
      );
    },
    [reviews, user]
  );

  // Calculate average rating for a dish
  const getAverageRating = useCallback(
    (dishId) => {
      const dishReviews = getReviewsForDishId(dishId);
      if (dishReviews.length === 0) return null;

      const sum = dishReviews.reduce((acc, review) => acc + review.Rating, 0);
      return (sum / dishReviews.length).toFixed(1);
    },
    [getReviewsForDishId]
  );

  // Initialize reviews on mount and user change
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const value = {
    reviews,
    loading,
    fetchReviews,
    getReviewsForDishId,
    getCustomerReviews,
    saveReview,
    deleteReview,
    getExistingReview,
    getAverageRating,
  };

  return (
    <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
  );
};

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReview must be used within a ReviewProvider");
  }
  return context;
};
