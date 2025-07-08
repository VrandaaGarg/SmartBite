// Local Storage utilities for SmartBite
// This will be replaced with Appwrite later

import { dishes as defaultDishesData } from "../Data/dishes";

// Storage keys
export const STORAGE_KEYS = {
  USERS: "smartbite_users",
  CURRENT_USER: "current_user",
  DISHES: "smartbite_dishes",
  CART: "smartbite_cart",
  ORDERS: "smartbite_orders",
  REVIEWS: "smartbite_reviews",
};

// Utility functions
export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return null;
  }
};

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting ${key} to localStorage:`, error);
    return false;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};

// Generate unique IDs
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Initialize default data if not exists
export const initializeDefaultData = () => {
  // Initialize users if not exists
  if (!getFromStorage(STORAGE_KEYS.USERS)) {
    const defaultUsers = [
      {
        CustomerID: 1,
        Name: "Test User",
        Email: "testuser@gmail.com",
        Phone: "1234567890",
        Password: "$2b$10$hashedpassword", // This will be handled by auth
        HouseNo: "123",
        Street: "Main Street",
        Landmark: "Near Park",
        City: "Mumbai",
        State: "Maharashtra",
        Pincode: "400001",
        IsAdmin: 0,
        CreatedAt: new Date().toISOString(),
      },
      {
        CustomerID: 2,
        Name: "Admin User",
        Email: "admin@gmail.com",
        Phone: "9876543210",
        Password: "$2b$10$hashedpassword",
        HouseNo: "456",
        Street: "Admin Street",
        Landmark: "Near Office",
        City: "Mumbai",
        State: "Maharashtra",
        Pincode: "400002",
        IsAdmin: 1,
        CreatedAt: new Date().toISOString(),
      },
    ];
    setToStorage(STORAGE_KEYS.USERS, defaultUsers);
  }

  // Initialize dishes if not exists
  if (!getFromStorage(STORAGE_KEYS.DISHES)) {
    setToStorage(STORAGE_KEYS.DISHES, defaultDishesData);
  }

  // Initialize empty arrays for other data
  if (!getFromStorage(STORAGE_KEYS.ORDERS)) {
    setToStorage(STORAGE_KEYS.ORDERS, []);
  }

  if (!getFromStorage(STORAGE_KEYS.REVIEWS)) {
    setToStorage(STORAGE_KEYS.REVIEWS, []);
  }
};

// User management functions
export const getAllUsers = () => {
  return getFromStorage(STORAGE_KEYS.USERS) || [];
};

export const getUserByEmail = (email) => {
  const users = getAllUsers();
  return users.find((user) => user.Email === email);
};

export const createUser = (userData) => {
  const users = getAllUsers();
  const newUser = {
    ...userData,
    CustomerID:
      users.length > 0 ? Math.max(...users.map((u) => u.CustomerID)) + 1 : 1,
    IsAdmin: 0,
    CreatedAt: new Date().toISOString(),
  };
  users.push(newUser);
  setToStorage(STORAGE_KEYS.USERS, users);
  return newUser;
};

export const updateUser = (customerId, updates) => {
  const users = getAllUsers();
  const userIndex = users.findIndex((user) => user.CustomerID === customerId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates };
    setToStorage(STORAGE_KEYS.USERS, users);
    return users[userIndex];
  }
  return null;
};

// Dish management functions
export const getAllDishes = () => {
  return getFromStorage(STORAGE_KEYS.DISHES) || [];
};

export const getDishById = (dishId) => {
  const dishes = getAllDishes();
  return dishes.find((dish) => dish.DishID === parseInt(dishId));
};

export const createDish = (dishData) => {
  const dishes = getAllDishes();
  const newDish = {
    ...dishData,
    DishID:
      dishes.length > 0 ? Math.max(...dishes.map((d) => d.DishID)) + 1 : 1,
    IsAvailable: 1,
    CreatedAt: new Date().toISOString(),
  };
  dishes.push(newDish);
  setToStorage(STORAGE_KEYS.DISHES, dishes);
  return newDish;
};

export const updateDish = (dishId, updates) => {
  const dishes = getAllDishes();
  const dishIndex = dishes.findIndex(
    (dish) => dish.DishID === parseInt(dishId)
  );
  if (dishIndex !== -1) {
    dishes[dishIndex] = { ...dishes[dishIndex], ...updates };
    setToStorage(STORAGE_KEYS.DISHES, dishes);
    return dishes[dishIndex];
  }
  return null;
};

export const deleteDish = (dishId) => {
  const dishes = getAllDishes();
  const filteredDishes = dishes.filter(
    (dish) => dish.DishID !== parseInt(dishId)
  );
  setToStorage(STORAGE_KEYS.DISHES, filteredDishes);
  return true;
};

// Cart management functions
export const getCartForUser = (customerId) => {
  const allCarts = getFromStorage(STORAGE_KEYS.CART) || {};
  return allCarts[customerId] || [];
};

export const setCartForUser = (customerId, cartItems) => {
  const allCarts = getFromStorage(STORAGE_KEYS.CART) || {};
  allCarts[customerId] = cartItems;
  setToStorage(STORAGE_KEYS.CART, allCarts);
};

export const addToCart = (customerId, dishId, quantity = 1) => {
  const cart = getCartForUser(customerId);
  const dish = getDishById(dishId);

  if (!dish) return false;

  const existingItem = cart.find((item) => item.DishID === parseInt(dishId));

  if (existingItem) {
    existingItem.Quantity += quantity;
  } else {
    cart.push({
      DishID: dish.DishID,
      Name: dish.Name,
      Price: dish.Price,
      Image: dish.Image,
      Description: dish.Description,
      Quantity: quantity,
    });
  }

  setCartForUser(customerId, cart);
  return true;
};

export const updateCartQuantity = (customerId, dishId, quantity) => {
  const cart = getCartForUser(customerId);
  const itemIndex = cart.findIndex((item) => item.DishID === parseInt(dishId));

  if (itemIndex !== -1) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].Quantity = quantity;
    }
    setCartForUser(customerId, cart);
    return true;
  }
  return false;
};

export const removeFromCart = (customerId, dishId) => {
  const cart = getCartForUser(customerId);
  const filteredCart = cart.filter((item) => item.DishID !== parseInt(dishId));
  setCartForUser(customerId, filteredCart);
  return true;
};

export const clearCart = (customerId) => {
  setCartForUser(customerId, []);
  return true;
};

// Order management functions
export const getAllOrders = () => {
  return getFromStorage(STORAGE_KEYS.ORDERS) || [];
};

export const getOrdersByCustomer = (customerId) => {
  const orders = getAllOrders();
  return orders.filter((order) => order.CustomerID === parseInt(customerId));
};

export const createOrder = (orderData) => {
  const orders = getAllOrders();
  const newOrder = {
    ...orderData,
    OrderID:
      orders.length > 0 ? Math.max(...orders.map((o) => o.OrderID)) + 1 : 1,
    OrderDate: new Date().toISOString(),
    Status: "Pending",
  };
  orders.push(newOrder);
  setToStorage(STORAGE_KEYS.ORDERS, orders);
  return newOrder;
};

export const updateOrderStatus = (orderId, status) => {
  const orders = getAllOrders();
  const orderIndex = orders.findIndex(
    (order) => order.OrderID === parseInt(orderId)
  );
  if (orderIndex !== -1) {
    orders[orderIndex].Status = status;
    setToStorage(STORAGE_KEYS.ORDERS, orders);
    return orders[orderIndex];
  }
  return null;
};

// Review management functions
export const getAllReviews = () => {
  return getFromStorage(STORAGE_KEYS.REVIEWS) || [];
};

export const getReviewsForDish = (dishId) => {
  const reviews = getAllReviews();
  return reviews.filter((review) => review.DishID === parseInt(dishId));
};

export const getReviewsByCustomer = (customerId) => {
  const reviews = getAllReviews();
  return reviews.filter((review) => review.CustomerID === parseInt(customerId));
};

export const addReview = (reviewData) => {
  const reviews = getAllReviews();
  const newReview = {
    ...reviewData,
    ReviewID:
      reviews.length > 0 ? Math.max(...reviews.map((r) => r.ReviewID)) + 1 : 1,
    CreatedAt: new Date().toISOString(),
  };
  reviews.push(newReview);
  setToStorage(STORAGE_KEYS.REVIEWS, reviews);
  return newReview;
};

export const updateReview = (customerId, dishId, updates) => {
  const reviews = getAllReviews();
  const reviewIndex = reviews.findIndex(
    (review) =>
      review.CustomerID === parseInt(customerId) &&
      review.DishID === parseInt(dishId)
  );

  if (reviewIndex !== -1) {
    reviews[reviewIndex] = { ...reviews[reviewIndex], ...updates };
    setToStorage(STORAGE_KEYS.REVIEWS, reviews);
    return reviews[reviewIndex];
  }
  return null;
};

// Initialize data on app start
export const initializeApp = () => {
  initializeDefaultData();
};
