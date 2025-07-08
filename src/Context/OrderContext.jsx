import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import emailjs from "@emailjs/browser";
import appwriteService from "../config/service";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);

  // ✅ Fetch orders from Appwrite
  const fetchOrders = async () => {
    if (!user?.$id) {
      setOrders([]);
      return;
    }

    try {
      const orderData = await appwriteService.getOrdersByUser(user.$id);
      // Transform the data to match expected format
      const transformedOrders = orderData.map((order) => ({
        ...order,
        OrderID: order.$id,
        OrderDate: order.orderedOn,
        CustomerID: order.userId,
        TotalAmount: order.totalAmount,
        PaymentMethod: order.paymentMethod,
        DeliveryAddress: order.address || "Address not available", // Use from database
        Items: Array.isArray(order.items)
          ? order.items.map((item) =>
              typeof item === "string" ? JSON.parse(item) : item
            )
          : order.items,
        Status: "Pending", // Default since not in collection
        ImageUrl: order.imgUrl || "", // Add image URL field
      }));
      setOrders(transformedOrders);
    } catch (error) {
      console.error("Order fetch error:", error);
      showToast("Error loading orders", "error");
      setOrders([]); // Set empty array on error
    }
  };

  // ✅ Place order with Appwrite and EmailJS
  const placeOrder = async (order) => {
    if (!user?.$id) {
      showToast("Please login to place order", "error");
      return null;
    }

    try {
      // Create order in Appwrite (including new address and imgUrl fields)
      const newOrder = await appwriteService.createOrder({
        userId: user.$id,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        items: order.items.map((item) => JSON.stringify(item)), // Convert each item to string for String[] array
        address: order.address || "", // Add address field
        imgUrl: order.imgUrl || "", // Add imgUrl field
      });

      // Clear cart after successful order
      await appwriteService.clearCart(user.$id);

      // Update local state with transformed order
      const transformedOrder = {
        ...newOrder,
        OrderID: newOrder.$id,
        OrderDate: newOrder.orderedOn,
        CustomerID: newOrder.userId,
        TotalAmount: newOrder.totalAmount,
        PaymentMethod: newOrder.paymentMethod,
        DeliveryAddress: newOrder.address || order.address, // Use from database or fallback to original
        Items: Array.isArray(newOrder.items)
          ? newOrder.items.map((item) =>
              typeof item === "string" ? JSON.parse(item) : item
            )
          : newOrder.items,
        Status: "Pending", // Default status
        CustomerName: user.name || user.Name,
        CustomerEmail: user.email || user.Email,
        CustomerPhone: user.phone || user.Phone,
        ImageUrl: newOrder.imgUrl || "", // Add image URL field
      };
      setOrders((prev) => [transformedOrder, ...prev]);

      // ✅ Send email via EmailJS
      emailjs
        .send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            order_id: transformedOrder.OrderID,
            created_at: new Date(transformedOrder.OrderDate).toLocaleString(
              "en-IN",
              {
                dateStyle: "long",
                timeStyle: "short",
              }
            ),
            payment_method: transformedOrder.PaymentMethod,
            address: transformedOrder.DeliveryAddress,
            total: transformedOrder.TotalAmount,
            year: new Date().getFullYear(),
            user_email: user?.email || user?.Email,
            items: transformedOrder.Items,
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
      return transformedOrder;
    } catch (error) {
      console.error("Order placement error:", error);
      showToast("Failed to place order", "error");
      return null;
    }
  };

  useEffect(() => {
    if (user?.$id) {
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
