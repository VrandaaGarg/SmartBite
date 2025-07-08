import { databases, DATABASE_ID, COLLECTION_IDS } from "./appwrite";
import { ID, Query } from "appwrite";

class AppwriteService {
  // ===== MENU OPERATIONS =====
  async getMenus() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.MENUS
      );
      return response.documents;
    } catch (error) {
      console.error("Error fetching menus:", error);
      throw error;
    }
  }

  async createMenu(menuData) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.MENUS,
        ID.unique(),
        menuData
      );
      return response;
    } catch (error) {
      console.error("Error creating menu:", error);
      throw error;
    }
  }

  // ===== DISH OPERATIONS =====
  async getDishes() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.DISHES
      );
      return response.documents;
    } catch (error) {
      console.error("Error fetching dishes:", error);
      throw error;
    }
  }

  async getDishesByMenu(menuId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.DISHES,
        [Query.equal("menuId", menuId)]
      );
      return response.documents;
    } catch (error) {
      console.error("Error fetching dishes by menu:", error);
      throw error;
    }
  }

  async getDishById(dishId) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_IDS.DISHES,
        dishId
      );
      return response;
    } catch (error) {
      console.error("Error fetching dish by ID:", error);
      throw error;
    }
  }

  async createDish(dishData) {
    try {
      const dishId = ID.unique();
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.DISHES,
        dishId,
        {
          ...dishData,
          dishId: dishId, // Add dishId to the document data
        }
      );
      return response;
    } catch (error) {
      console.error("Error creating dish:", error);
      throw error;
    }
  }

  async updateDish(dishId, dishData) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.DISHES,
        dishId,
        dishData
      );
      return response;
    } catch (error) {
      console.error("Error updating dish:", error);
      throw error;
    }
  }

  async deleteDish(dishId) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_IDS.DISHES,
        dishId
      );
      return { success: true };
    } catch (error) {
      console.error("Error deleting dish:", error);
      throw error;
    }
  }

  // ===== CART OPERATIONS =====
  async getCartByUser(userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.CARTS,
        [Query.equal("userId", userId)]
      );
      return response.documents;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  }

  async addToCart(cartData) {
    try {
      // Check if item already exists in cart
      const existingItems = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.CARTS,
        [
          Query.equal("userId", cartData.userId),
          Query.equal("dishId", cartData.dishId),
        ]
      );

      if (existingItems.documents.length > 0) {
        // Update quantity if item exists
        const existingItem = existingItems.documents[0];
        return await this.updateCartQuantity(
          existingItem.$id,
          existingItem.quantity + cartData.quantity
        );
      } else {
        // Create new cart item with cartId
        const cartId = ID.unique();
        const response = await databases.createDocument(
          DATABASE_ID,
          COLLECTION_IDS.CARTS,
          cartId,
          {
            ...cartData,
            cartId: cartId, // Add cartId to the document data
          }
        );
        return response;
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  }

  async updateCartQuantity(cartId, quantity) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.CARTS,
        cartId,
        { quantity }
      );
      return response;
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      throw error;
    }
  }

  async removeFromCart(cartId) {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_IDS.CARTS, cartId);
      return { success: true };
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  }

  async clearCart(userId) {
    try {
      const cartItems = await this.getCartByUser(userId);

      // If no cart items, return success
      if (!cartItems || cartItems.length === 0) {
        return { success: true };
      }

      const deletePromises = cartItems.map((item) =>
        databases.deleteDocument(DATABASE_ID, COLLECTION_IDS.CARTS, item.$id)
      );
      await Promise.all(deletePromises);
      return { success: true };
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  }

  // ===== ORDER OPERATIONS =====
  async getOrdersByUser(userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.ORDERS,
        [Query.equal("userId", userId), Query.orderDesc("orderedOn")]
      );
      return response.documents;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  async createOrder(orderData) {
    try {
      const orderId = ID.unique();
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.ORDERS,
        orderId,
        {
          ...orderData,
          orderId: orderId, // Add orderId to the document data
          orderedOn: new Date().toISOString(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  async getAllOrders() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.ORDERS,
        [Query.orderDesc("orderedOn")]
      );
      return response.documents;
    } catch (error) {
      console.error("Error fetching all orders:", error);
      throw error;
    }
  }

  // ===== REVIEW OPERATIONS =====
  async getReviews() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.REVIEWS,
        [Query.orderDesc("createdAt")]
      );
      return response.documents;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  }

  async getReviewsByDish(dishId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.REVIEWS,
        [Query.equal("dishId", dishId), Query.orderDesc("createdAt")]
      );
      return response.documents;
    } catch (error) {
      console.error("Error fetching reviews by dish:", error);
      throw error;
    }
  }

  async getReviewsByUser(userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.REVIEWS,
        [Query.equal("userId", userId), Query.orderDesc("createdAt")]
      );
      return response.documents;
    } catch (error) {
      console.error("Error fetching reviews by user:", error);
      throw error;
    }
  }

  async createReview(reviewData) {
    try {
      const reviewId = ID.unique();
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.REVIEWS,
        reviewId,
        {
          ...reviewData,
          reviewId: reviewId, // Add reviewId to the document data
          createdAt: new Date().toISOString(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  }

  async updateReview(reviewId, reviewData) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.REVIEWS,
        reviewId,
        reviewData
      );
      return response;
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
    }
  }

  async deleteReview(reviewId) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_IDS.REVIEWS,
        reviewId
      );
      return { success: true };
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  }

  // ===== USER OPERATIONS =====
  async getAllUsers() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.USERS
      );
      return response.documents;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async updateUser(userId, userData) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.USERS,
        userId,
        userData
      );
      return response;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
}

const appwriteService = new AppwriteService();
export default appwriteService;
