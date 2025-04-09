import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    if (user?.id) {
      const userCart = JSON.parse(localStorage.getItem("user_cart")) || {};
      setCart(userCart[user.id] || []);
    }
    // Do NOT clear cart unless user is explicitly logged out
    else if (user === null) {
      setCart([]);
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      const userCart = JSON.parse(localStorage.getItem("user_cart")) || {};
      userCart[user.id] = cart;
      localStorage.setItem("user_cart", JSON.stringify(userCart));
    }
  }, [cart, user]);

  const addToCart = (dish) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === dish.id);
      if (exists) {
        showToast("Item already in cart update quantity", "warning");
        return prev.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        showToast("Item added to cart", "success");
        return [...prev, { ...dish, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast("Item removed from cart", "error");
  };

  const updateQuantity = (id, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, qty) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    if (user?.id) {
      const userCart = JSON.parse(localStorage.getItem("user_cart")) || {};
      userCart[user.id] = [];
      localStorage.setItem("user_cart", JSON.stringify(userCart));
      showToast("Cart cleared", "success");
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
