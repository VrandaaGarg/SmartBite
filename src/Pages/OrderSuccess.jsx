import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaArrowLeft,
  FaHome,
  FaReceipt,
  FaMapMarkerAlt,
  FaCreditCard,
} from "react-icons/fa";

const OrderSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [animateIn, setAnimateIn] = useState(false);

  const order = state?.order;

  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const estimatedDelivery = new Date();
  estimatedDelivery.setMinutes(estimatedDelivery.getMinutes() + 30);

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <FaReceipt className="text-5xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-3">
            No Order Details Found
          </h2>
          <p className="text-gray-500 mb-6">
            We couldn't find details for your recent order. It may have been
            processed in another session.
          </p>
          <button
            onClick={() => navigate("/orders")}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 mr-3 transition"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      {/* Header */}
      <div
        className={`text-center mb-10 transition-all duration-700 transform ${
          animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-5">
          <FaCheckCircle className="text-green-600 text-5xl" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          Order Placed Successfully!
        </h1>
        <p className="text-xl text-gray-600">
          Thank you for your order. We're preparing your delicious food!
        </p>
      </div>

      {/* Order Details */}
      <div
        className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-700 transform ${
          animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
        style={{ transitionDelay: "0.3s" }}
      >
        <div className="bg-red-600 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Order #{order.OrderID}</h2>
              <p className="text-sm text-red-100">
                {new Date(order.OrderDate).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">₹{order.TotalAmount}</div>
              <p className="text-sm text-red-100">
                {order.Items?.length || 0} items
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Your Order
          </h3>
          {order.Items?.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center py-2">
              <div className="flex items-center">
                <span className="text-red-600 font-medium mr-2">
                  {item.quantity}×
                </span>
                <span className="text-gray-800">{item.name}</span>
              </div>
              <span className="font-medium text-gray-700">
                ₹{item.price * item.quantity}
              </span>
            </div>
          )) || <p className="text-gray-500">No items found</p>}
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-red-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800">
                  Delivery Address
                </h4>
                <p className="text-gray-600">{order.DeliveryAddress}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaCreditCard className="text-red-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800">Payment Method</h4>
                <p className="text-gray-600 uppercase">{order.PaymentMethod}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">
              Estimated Delivery
            </h4>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-gray-800">
                {estimatedDelivery.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="text-sm text-gray-600">~30 minutes</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div
                className="bg-red-600 h-2 rounded-full animate-pulse"
                style={{ width: "15%" }}
              ></div>
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>Order Received</span>
              <span>Preparing</span>
              <span>On the Way</span>
              <span>Delivered</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:justify-between">
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center justify-center gap-2 px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            <FaReceipt /> View All Orders
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <FaHome /> Back to Home
          </button>
        </div>
      </div>

      <div
        className={`text-center mt-8 text-gray-500 transition-all duration-700 transform ${
          animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
        style={{ transitionDelay: "0.6s" }}
      >
        <p>
          Need help with your order?{" "}
          <a href="/support" className="text-red-600 hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;
