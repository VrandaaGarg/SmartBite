import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const OrderSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  if (!order) {
    return (
      <div className="text-center mt-20 text-xl text-gray-600">
        No recent order found.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-16 bg-white p-6 rounded shadow text-center animate-fadeIn">
      <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
      <h2 className="text-3xl font-bold text-red-600 mb-2">Thank You!</h2>
      <p className="text-gray-600 mb-4">
        Your order <span className="font-semibold">#{order.id}</span> has been
        placed successfully.
      </p>

      <div className="text-left mt-6 text-gray-700">
        <p><strong>Payment:</strong> {order.paymentMethod.toUpperCase()}</p>
        <p><strong>Total:</strong> ₹{order.totalAmount}</p>
        <p><strong>Items:</strong> {order.items.length}</p>
        <p><strong>Delivery Address:</strong> {order.address}</p>
        <p><strong>Order Time:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-8 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
      >
        Back to Home
      </button>
    </div>
  );
};

export default OrderSuccess;