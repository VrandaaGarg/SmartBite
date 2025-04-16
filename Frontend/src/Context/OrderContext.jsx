import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import emailjs from "@emailjs/browser";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);

  // ✅ Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${user.CustomerID}`);
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      } else {
        showToast(data.error || "Failed to fetch orders", "error");
      }
    } catch (error) {
      console.error("Order fetch error:", error);
      showToast("Error loading orders", "error");
    }
  };
  

  // ✅ Place order with EmailJS
  const placeOrder = (order) => {
    const newOrder = {
      ...order,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);

    // ✅ Email Notification
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
        items: newOrder.items
          .map((item) => `${item.name} x${item.quantity} - ₹${item.price * item.quantity}`)
          .join(", "),
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => {
      console.log("✅ Email sent!");
    })
    .catch((err) => {
      console.error("❌ Failed to send email:", err);
    });

    showToast("Order placed successfully! Email sent.", "success");
    return newOrder;
  };

  // 🧠 Load orders when user logs in
  useEffect(() => {
    if (user?.CustomerID) {
      fetchOrders(user.CustomerID);
    } else {
      setOrders([]);
    }
  }, [user]);

  // ❌ Clear all orders (optional)
  const clearOrders = () => {
    setOrders([]);
    showToast("Order history cleared", "info");
  };

  return (
    <OrderContext.Provider value={{ orders, fetchOrders, placeOrder, clearOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
