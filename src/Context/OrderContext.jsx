import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);

  // 🧠 Load orders for the current user
  useEffect(() => {
    if (user?.id) {
      const allOrders = JSON.parse(localStorage.getItem("orders")) || {};
      setOrders(allOrders[user.id] || []);
    } else {
      setOrders([]);
    }
  }, [user]);

  // 📝 Save updated orders for this user
  const saveOrders = (newOrders) => {
    if (!user?.id) return;

    const allOrders = JSON.parse(localStorage.getItem("orders")) || {};
    allOrders[user.id] = newOrders;
    localStorage.setItem("orders", JSON.stringify(allOrders));
    setOrders(newOrders);
  };

  // ✅ Place new order
  const placeOrder = (order) => {
    const newOrder = {
      ...order,
      id: Date.now(), // unique order ID
      createdAt: new Date().toISOString(),
    };

    const updatedOrders = [newOrder, ...orders];
    saveOrders(updatedOrders);
    showToast("Order placed successfully!", "success");
    return newOrder;
  };

  // ❌ Clear all orders for this user (optional)
  const clearOrders = () => {
    saveOrders([]);
    showToast("Order history cleared", "info");
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, clearOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);