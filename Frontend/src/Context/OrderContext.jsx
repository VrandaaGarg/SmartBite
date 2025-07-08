import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import emailjs from "@emailjs/browser";
import {
  getOrdersByCustomer,
  createOrder,
  clearCart,
} from "../utils/localStorage";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);

  // ✅ Fetch orders from local storage
  const fetchOrders = async () => {
    if (!user?.CustomerID) {
      setOrders([]);
      return;
    }

    try {
      const orderData = getOrdersByCustomer(user.CustomerID);
      setOrders(orderData);
    } catch (error) {
      console.error("Order fetch error:", error);
      showToast("Error loading orders", "error");
    }
  };

  // ✅ Place order with local storage and EmailJS
  const placeOrder = (order) => {
    if (!user?.CustomerID) {
      showToast("Please login to place order", "error");
      return null;
    }

    try {
      // Create order in local storage
      const newOrder = createOrder({
        CustomerID: user.CustomerID,
        TotalAmount: order.totalAmount,
        PaymentMethod: order.paymentMethod,
        DeliveryAddress: order.address,
        Items: order.items,
        CustomerName: user.Name,
        CustomerEmail: user.Email,
        CustomerPhone: user.Phone,
      });

      // Clear cart after successful order
      clearCart(user.CustomerID);

      // Update local state
      setOrders((prev) => [newOrder, ...prev]);

      // ✅ Send email via EmailJS
      emailjs
        .send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            order_id: newOrder.OrderID,
            created_at: new Date(newOrder.OrderDate).toLocaleString("en-IN", {
              dateStyle: "long",
              timeStyle: "short",
            }),
            payment_method: newOrder.PaymentMethod,
            address: newOrder.DeliveryAddress,
            total: newOrder.TotalAmount,
            year: new Date().getFullYear(),
            user_email: user?.Email,
            items: newOrder.Items,
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
    } catch (error) {
      console.error("Order placement error:", error);
      showToast("Failed to place order", "error");
      return null;
    }
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

  const refreshReviewInOrders = (dishId, reviewData) => {
    setOrders((prev) =>
      prev.map((order) => ({
        ...order,
        Items: (order.Items || []).map((item) =>
          item.DishID === dishId ? { ...item, review: reviewData } : item
        ),
      }))
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        refreshReviewInOrders,
        fetchOrders,
        placeOrder,
        clearOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
