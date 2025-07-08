import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { 
  getAllReviews, 
  getAllUsers, 
  getReviewsForDish, 
  getReviewsByCustomer,
  STORAGE_KEYS 
} from '../utils/localStorage';

const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all reviews and enrich with customer names
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const reviewData = getAllReviews();
      const users = getAllUsers();
      
      // Enrich reviews with customer names
      const enrichedReviews = reviewData.map(review => {
        const customer = users.find(user => user.CustomerID === review.CustomerID);
        return {
          ...review,
          CustomerName: customer ? customer.Name : 'Anonymous User'
        };
      });

      setReviews(enrichedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      showToast('Error loading reviews', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Get reviews for a specific dish
  const getReviewsForDishId = useCallback((dishId) => {
    return reviews.filter(review => review.DishID === parseInt(dishId))
      .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
  }, [reviews]);

  // Get reviews by customer
  const getCustomerReviews = useCallback((customerId) => {
    return reviews.filter(review => review.CustomerID === parseInt(customerId))
      .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
  }, [reviews]);

  // Add or update a review
  const saveReview = useCallback(async (reviewData) => {
    if (!user?.CustomerID) {
      showToast('Please login to submit review', 'error');
      return null;
    }

    try {
      const existingReviews = getAllReviews();
      const users = getAllUsers();
      
      const newReviewData = {
        DishID: reviewData.DishID,
        CustomerID: user.CustomerID,
        Rating: reviewData.Rating,
        Comment: reviewData.Comment,
        CreatedAt: new Date().toISOString(),
        ReviewID: reviewData.ReviewID || `review_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
      };

      // Check if review already exists
      const existingReviewIndex = existingReviews.findIndex(
        review => review.DishID === reviewData.DishID && review.CustomerID === user.CustomerID
      );

      let updatedReviews;
      let isUpdate = false;

      if (existingReviewIndex !== -1) {
        // Update existing review
        updatedReviews = [...existingReviews];
        updatedReviews[existingReviewIndex] = { 
          ...updatedReviews[existingReviewIndex], 
          ...newReviewData 
        };
        isUpdate = true;
      } else {
        // Add new review
        updatedReviews = [...existingReviews, newReviewData];
      }

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updatedReviews));

      // Enrich the new review with customer name
      const customer = users.find(u => u.CustomerID === user.CustomerID);
      const enrichedReview = {
        ...newReviewData,
        CustomerName: customer ? customer.Name : 'Anonymous User'
      };

      // Update local state
      if (isUpdate) {
        setReviews(prev => prev.map(review => 
          review.DishID === reviewData.DishID && review.CustomerID === user.CustomerID
            ? enrichedReview
            : review
        ));
      } else {
        setReviews(prev => [enrichedReview, ...prev]);
      }

      // Trigger storage event for other components
      window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEYS.REVIEWS,
        newValue: JSON.stringify(updatedReviews)
      }));

      showToast(
        isUpdate ? 'Review updated successfully!' : 'Review submitted successfully!',
        'success'
      );

      return enrichedReview;
    } catch (error) {
      console.error('Error saving review:', error);
      showToast('Failed to save review', 'error');
      return null;
    }
  }, [user, showToast]);

  // Delete a review
  const deleteReview = useCallback(async (dishId, customerId = null) => {
    const targetCustomerId = customerId || user?.CustomerID;
    
    if (!targetCustomerId) {
      showToast('Unable to delete review', 'error');
      return false;
    }

    try {
      const existingReviews = getAllReviews();
      const updatedReviews = existingReviews.filter(
        review => !(review.DishID === parseInt(dishId) && review.CustomerID === parseInt(targetCustomerId))
      );

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updatedReviews));

      // Update local state
      setReviews(prev => prev.filter(
        review => !(review.DishID === parseInt(dishId) && review.CustomerID === parseInt(targetCustomerId))
      ));

      // Trigger storage event for other components
      window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEYS.REVIEWS,
        newValue: JSON.stringify(updatedReviews)
      }));

      showToast('Review deleted successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      showToast('Failed to delete review', 'error');
      return false;
    }
  }, [user, showToast]);

  // Get existing review for a dish by current user
  const getExistingReview = useCallback((dishId) => {
    if (!user?.CustomerID) return null;
    
    return reviews.find(
      review => review.DishID === parseInt(dishId) && review.CustomerID === user.CustomerID
    ) || null;
  }, [reviews, user]);

  // Calculate average rating for a dish
  const getAverageRating = useCallback((dishId) => {
    const dishReviews = getReviewsForDishId(dishId);
    if (dishReviews.length === 0) return null;
    
    const sum = dishReviews.reduce((acc, review) => acc + review.Rating, 0);
    return (sum / dishReviews.length).toFixed(1);
  }, [getReviewsForDishId]);

  // Initialize reviews on mount and user change
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Listen for storage changes from other tabs/components
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEYS.REVIEWS) {
        fetchReviews();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
    getAverageRating
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReview must be used within a ReviewProvider');
  }
  return context;
};
