import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import {
  getCartForUser,
  addToCart as addToCartStorage,
  updateCartQuantity as updateCartQuantityStorage,
  removeFromCart as removeFromCartStorage,
  clearCart as clearCartStorage,
  getDishById,
} from "../utils/localStorage";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartTrigger, setCartTrigger] = useState(0); // 🔁 new trigger state
  const toastTimeoutRef = useRef(null);
  const pendingToastRef = useRef(null);

  const showSingleToast = useCallback(
    (message, type) => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      pendingToastRef.current = { message, type };
      toastTimeoutRef.current = setTimeout(() => {
        if (pendingToastRef.current) {
          showToast(
            pendingToastRef.current.message,
            pendingToastRef.current.type
          );
          pendingToastRef.current = null;
        }
      }, 300);
    },
    [showToast]
  );

  // 🔃 Fetch Cart from local storage
  const fetchCart = useCallback(() => {
    if (!user?.CustomerID) {
      setCart([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const cartData = getCartForUser(user.CustomerID);
      const normalized = cartData.map((item) => ({
        DishID: item.DishID,
        quantity: item.Quantity,
        price: item.Price,
        name: item.Name,
        image: item.Image,
        description: item.Description,
      }));

      setCart(normalized);
    } catch (err) {
      console.error("Error fetching cart:", err);
      showSingleToast("Failed to load cart", "error");
    } finally {
      setLoading(false);
    }
  }, [user, showSingleToast]);

  // 🧠 Watch for login & updates
  useEffect(() => {
    if (user?.CustomerID) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user, fetchCart, cartTrigger]); // 🔥 include cartTrigger

  // ➕ Add to Cart
  const addToCart = async (dish) => {
    if (!user?.CustomerID) {
      showSingleToast("Please login to add items to cart", "error");
      return;
    }

    try {
      const success = addToCartStorage(user.CustomerID, dish.DishID, 1);
      if (success) {
        showSingleToast(`${dish.Name} added to cart`, "success");
        fetchCart();
      } else {
        throw new Error("Failed to add to cart");
      }
    } catch (err) {
      console.error(err);
      showSingleToast("Error adding to cart", "error");
    }
  };

  const updateQuantity = async (DishID, newQuantity) => {
    if (newQuantity <= 0) return removeFromCart(DishID);

    if (!user?.CustomerID) {
      showSingleToast("Please login first", "error");
      return;
    }

    try {
      const success = updateCartQuantityStorage(
        user.CustomerID,
        DishID,
        newQuantity
      );
      if (success) {
        fetchCart();
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      console.error(err);
      showSingleToast("Error updating quantity", "error");
    }
  };

  const removeFromCart = async (DishID) => {
    if (!user?.CustomerID) {
      showSingleToast("Please login first", "error");
      return;
    }

    try {
      const success = removeFromCartStorage(user.CustomerID, DishID);
      if (success) {
        showSingleToast("Item removed from cart", "info");
        fetchCart();
      } else {
        throw new Error("Failed to remove item");
      }
    } catch (err) {
      console.error(err);
      showSingleToast("Error removing item", "error");
    }
  };

  const clearCart = async () => {
    if (!user?.CustomerID) {
      showSingleToast("Please login first", "error");
      return;
    }

    try {
      const success = clearCartStorage(user.CustomerID);
      if (success) {
        setCart([]);
        showSingleToast("Cart cleared", "info");
      } else {
        throw new Error("Failed to clear cart");
      }
    } catch (err) {
      console.error(err);
      showSingleToast("Error clearing cart", "error");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
