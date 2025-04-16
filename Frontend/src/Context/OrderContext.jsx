import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import emailjs from "@emailjs/browser";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);

  // ✅ Fetch orders
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
      createdAt: new Date().toLocaleString("en-IN", {
        dateStyle: "long",
        timeStyle: "short"
      }),
      
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);

    // ✅ Send email via EmailJS
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
        user_email: user?.Email, // ✅ double-check this is Email not email
        items: newOrder.items,   // ✅ SEND RAW ARRAY
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

  useEffect(() => {
    if (user?.CustomerID) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [user]);

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
