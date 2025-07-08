// Admin utilities for local storage management
import {
  getAllUsers,
  getAllDishes,
  getAllOrders,
  getAllReviews,
  createDish,
  updateDish,
  deleteDish,
  updateUser,
  updateOrderStatus,
  STORAGE_KEYS,
  getFromStorage,
  setToStorage,
} from "./localStorage";

// Admin Dashboard Statistics
export const getAdminStats = () => {
  const users = getAllUsers();
  const dishes = getAllDishes();
  const orders = getAllOrders();
  const reviews = getAllReviews();

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.TotalAmount || 0),
    0
  );
  const pendingOrders = orders.filter(
    (order) => order.Status === "Pending"
  ).length;
  const completedOrders = orders.filter(
    (order) => order.Status === "Completed"
  ).length;

  return {
    totalUsers: users.length,
    totalDishes: dishes.length,
    totalOrders: orders.length,
    totalRevenue,
    pendingOrders,
    completedOrders,
    totalReviews: reviews.length,
    averageRating:
      reviews.length > 0
        ? (
            reviews.reduce((sum, review) => sum + review.Rating, 0) /
            reviews.length
          ).toFixed(1)
        : 0,
  };
};

// Dish Management
export const addNewDish = (dishData) => {
  try {
    const newDish = createDish(dishData);
    return { success: true, dish: newDish };
  } catch (error) {
    console.error("Error adding dish:", error);
    return { success: false, error: error.message };
  }
};

export const editDish = (dishId, updates) => {
  try {
    const updatedDish = updateDish(dishId, updates);
    if (updatedDish) {
      return { success: true, dish: updatedDish };
    } else {
      return { success: false, error: "Dish not found" };
    }
  } catch (error) {
    console.error("Error updating dish:", error);
    return { success: false, error: error.message };
  }
};

export const removeDish = (dishId) => {
  try {
    const success = deleteDish(dishId);
    return { success };
  } catch (error) {
    console.error("Error deleting dish:", error);
    return { success: false, error: error.message };
  }
};

// User Management
export { getAllUsers, getAllOrders } from "./localStorage";

export const promoteToAdmin = (customerId) => {
  try {
    const updatedUser = updateUser(customerId, { IsAdmin: 1 });
    if (updatedUser) {
      return { success: true, user: updatedUser };
    } else {
      return { success: false, error: "User not found" };
    }
  } catch (error) {
    console.error("Error promoting user:", error);
    return { success: false, error: error.message };
  }
};

export const demoteAdmin = (customerId) => {
  try {
    const updatedUser = updateUser(customerId, { IsAdmin: 0 });
    if (updatedUser) {
      return { success: true, user: updatedUser };
    } else {
      return { success: false, error: "User not found" };
    }
  } catch (error) {
    console.error("Error demoting user:", error);
    return { success: false, error: error.message };
  }
};

// Order Management
export const updateOrder = (orderId, status) => {
  try {
    const updatedOrder = updateOrderStatus(orderId, status);
    if (updatedOrder) {
      return { success: true, order: updatedOrder };
    } else {
      return { success: false, error: "Order not found" };
    }
  } catch (error) {
    console.error("Error updating order:", error);
    return { success: false, error: error.message };
  }
};

// Data Export/Import for backup
export const exportData = () => {
  try {
    const data = {
      users: getAllUsers(),
      dishes: getAllDishes(),
      orders: getAllOrders(),
      reviews: getAllReviews(),
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `smartbite-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error("Error exporting data:", error);
    return { success: false, error: error.message };
  }
};

export const importData = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        // Validate data structure
        if (!data.users || !data.dishes || !data.orders || !data.reviews) {
          resolve({ success: false, error: "Invalid backup file format" });
          return;
        }

        // Import data
        setToStorage(STORAGE_KEYS.USERS, data.users);
        setToStorage(STORAGE_KEYS.DISHES, data.dishes);
        setToStorage(STORAGE_KEYS.ORDERS, data.orders);
        setToStorage(STORAGE_KEYS.REVIEWS, data.reviews);

        resolve({ success: true });
      } catch (error) {
        console.error("Error importing data:", error);
        resolve({ success: false, error: "Failed to parse backup file" });
      }
    };
    reader.readAsText(file);
  });
};

// Reset all data (for development/testing)
export const resetAllData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.DISHES);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.CART);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

    return { success: true };
  } catch (error) {
    console.error("Error resetting data:", error);
    return { success: false, error: error.message };
  }
};

// Get recent activity for dashboard
export const getRecentActivity = (limit = 10) => {
  const orders = getAllOrders();
  const reviews = getAllReviews();
  const users = getAllUsers();

  const activities = [];

  // Recent orders
  orders.slice(0, limit).forEach((order) => {
    activities.push({
      type: "order",
      message: `New order #${order.OrderID} placed by ${order.CustomerName}`,
      timestamp: order.OrderDate,
      amount: order.TotalAmount,
    });
  });

  // Recent reviews
  reviews.slice(0, limit).forEach((review) => {
    activities.push({
      type: "review",
      message: `New ${review.Rating}-star review received`,
      timestamp: review.CreatedAt,
      rating: review.Rating,
    });
  });

  // Recent registrations
  users.slice(-limit).forEach((user) => {
    activities.push({
      type: "user",
      message: `New user ${user.Name} registered`,
      timestamp: user.CreatedAt,
    });
  });

  // Sort by timestamp and return limited results
  return activities
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
};

// Sales analytics
export const getSalesAnalytics = (days = 30) => {
  const orders = getAllOrders();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const recentOrders = orders.filter(
    (order) => new Date(order.OrderDate) >= cutoffDate
  );

  const dailySales = {};
  recentOrders.forEach((order) => {
    const date = new Date(order.OrderDate).toDateString();
    if (!dailySales[date]) {
      dailySales[date] = { orders: 0, revenue: 0 };
    }
    dailySales[date].orders += 1;
    dailySales[date].revenue += order.TotalAmount;
  });

  return {
    totalOrders: recentOrders.length,
    totalRevenue: recentOrders.reduce(
      (sum, order) => sum + order.TotalAmount,
      0
    ),
    averageOrderValue:
      recentOrders.length > 0
        ? recentOrders.reduce((sum, order) => sum + order.TotalAmount, 0) /
          recentOrders.length
        : 0,
    dailySales,
  };
};
