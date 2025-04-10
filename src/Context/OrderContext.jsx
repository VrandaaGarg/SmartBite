import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import emailjs from "@emailjs/browser";

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

  // ✅ Place new order - updated to ensure toast auto-removes after 3 seconds
  const placeOrder = (order) => {
    const newOrder = {
      ...order,
      id: Date.now(),
      createdAt: new Date().toLocaleString(),
    };
  
    const updatedOrders = [newOrder, ...orders];
    saveOrders(updatedOrders);
    
    // Show a single toast message that will auto-remove after 3 seconds (handled by ToastContext)
    showToast("Order placed successfully! A confirmation has been sent to your email.", "success");
  
    // ✅ Send email to admin
    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        order_id: newOrder.id,
        created_at: newOrder.createdAt,
        payment_method: newOrder.paymentMethod,
        address: newOrder.address,
        total: newOrder.totalAmount,
        year: new Date().getFullYear(),
        user_email: user?.email,
        items: newOrder.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price * item.quantity,
        })),
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => console.log("✅ Order mail sent to admin and customer"))
    .catch((err) => console.error("❌ Failed to send email:", err));
    
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