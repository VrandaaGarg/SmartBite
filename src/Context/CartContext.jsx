import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [cart, setCart] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  // Improved toast management with global timeout ref
  const toastTimeoutRef = useRef(null);
  const pendingToastRef = useRef(null);

  // Single function to handle all toast messages with improved debouncing
  const showSingleToast = useCallback((message, type) => {
    // Clear any pending toast timeouts
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }

    // Store the intent to show a toast, but don't show immediately
    pendingToastRef.current = { message, type };

    // Use a single timeout to show the toast after all state updates
    toastTimeoutRef.current = setTimeout(() => {
      if (pendingToastRef.current) {
        showToast(pendingToastRef.current.message, pendingToastRef.current.type);
        pendingToastRef.current = null;
      }
      toastTimeoutRef.current = null;
    }, 300);
  }, [showToast]);

  // Load cart from localStorage
  useEffect(() => {
    if (user?.id) {
      const userCart = JSON.parse(localStorage.getItem("user_cart")) || {};
      setCart(userCart[user.id] || []);
      setCartLoaded(true);
    } else if (user === null) {
      setCart([]);
    }
  }, [user]);

  // Save cart to localStorage only after it's loaded
  useEffect(() => {
    if (user?.id && cartLoaded) {
      const userCart = JSON.parse(localStorage.getItem("user_cart")) || {};
      userCart[user.id] = cart;
      localStorage.setItem("user_cart", JSON.stringify(userCart));
    }
  }, [cart, user, cartLoaded]);

  // Clean up any pending toasts on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Add item to cart with single toast message
  const addToCart = useCallback((item) => {
    setCart(prevCart => {
      // Check if item already exists
      const exists = prevCart.find((x) => x.id === item.id);

      if (exists) {
        // Only show toast after state update is complete


        // Return updated cart
        return prevCart.map((x) =>
          x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x
        );
      } else {
        // Only show toast after state update is complete


        // Return updated cart
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  }, [showSingleToast]);

  // Update quantity
  const updateQuantity = useCallback((id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart(prevCart =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, []);

  // Remove from cart with single toast message
  const removeFromCart = useCallback((id) => {
    setCart(prevCart => {
      const itemToRemove = prevCart.find((item) => item.id === id);

      if (itemToRemove) {
        // Show toast only once after the operation is complete
        showSingleToast(`${itemToRemove.name} removed from cart`, "info");
      }

      return prevCart.filter((item) => item.id !== id);
    });
  }, [showSingleToast]);

  // Clear cart with single toast message
  const clearCart = useCallback(() => {
    setCart([]);
    showSingleToast("Cart cleared", "info");
  }, [showSingleToast]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);