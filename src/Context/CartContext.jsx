import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  // Load cart for current user when user logs in
  useEffect(() => {
    if (user?.id) {
      const allCarts = JSON.parse(localStorage.getItem("smartbite_cart_data")) || {};
      const currentUserCart = allCarts[user.id] || [];
      setCart(currentUserCart);
    } else {
      setCart([]); // Clear cart if user logs out or not found
    }
  }, [user]);

  // Save updated cart back to localStorage
  useEffect(() => {
    if (user?.id) {
      const allCarts = JSON.parse(localStorage.getItem("smartbite_cart_data")) || {};
      allCarts[user.id] = cart;
      localStorage.setItem("smartbite_cart_data", JSON.stringify(allCarts));
    }
  }, [cart, user]);

  // Add dish to cart
  const addToCart = (dish) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === dish.id);
      if (exists) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...dish, quantity: 1 }];
      }
    });
  };

  // Remove dish from cart
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Update quantity of item
  const updateQuantity = (id, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, qty) } : item
      )
    );
  };

  // Clear cart for current user
  const clearCart = () => {
    setCart([]);
    if (user?.id) {
      const allCarts = JSON.parse(localStorage.getItem("smartbite_cart_data")) || {};
      allCarts[user.id] = [];
      localStorage.setItem("smartbite_cart_data", JSON.stringify(allCarts));
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