import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);

  // Load current user's orders from localStorage
  useEffect(() => {
    if (user?.id) {
      const allOrders = JSON.parse(localStorage.getItem("orders")) || {};
      setOrders(allOrders[user.id] || []);
    } else {
      setOrders([]);
    }
  }, [user]);

  // Save updated orders to localStorage
  const saveOrders = (newOrders) => {
    if (!user?.id) return;
    const allOrders = JSON.parse(localStorage.getItem("orders")) || {};
    allOrders[user.id] = newOrders;
    localStorage.setItem("orders", JSON.stringify(allOrders));
    setOrders(newOrders);
  };

  // Add new order
  const placeOrder = (order) => {
    const newOrder = {
      ...order,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updatedOrders = [newOrder, ...orders];
    saveOrders(updatedOrders);
    showToast("Order placed successfully!", "success");
    return newOrder;
  };

  // Optional: Clear all orders for current user
  const clearOrders = () => {
    saveOrders([]);
    showToast("Order history cleared.", "info");
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, clearOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);