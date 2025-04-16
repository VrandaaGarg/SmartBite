import React, { useState, useEffect } from "react";
import { useOrder } from "../Context/OrderContext";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import {
  FaShoppingBag,
  FaReceipt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaRupeeSign,
} from "react-icons/fa";

const OrderHistory = () => {
  const { orders, fetchOrders } = useOrder();
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (user?.CustomerID) {
      fetchOrders(user.CustomerID);
      setTimeout(() => setIsLoaded(true), 300);
    }
  }, [user]);

  const getStatusBadge = (createdAt) => {
    const orderTime = new Date(createdAt);
    const now = new Date();
    const diff = (now - orderTime) / (1000 * 60); // in minutes

    if (diff < 30) return { label: "Preparing", color: "bg-blue-100 text-blue-800" };
    if (diff < 60) return { label: "Out for Delivery", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Delivered", color: "bg-green-100 text-green-800" };
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center animate-fadeIn">
          <FaShoppingBag className="text-7xl text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-3">No orders yet</h2>
          <p className="text-gray-500 max-w-sm mx-auto mb-8">
            Your order history will appear here once you've placed an order with us.
          </p>
          <Link
            to="/menu"
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-lg"
          >
            Browse Menu & Order Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 animate-fadeIn">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-2">Your Orders</h1>
        <p className="text-gray-600">Keep track of all your delicious meals</p>
      </div>

      <div className="space-y-6">
        {orders.map((order, index) => {
          const status = getStatusBadge(order.CreatedAt);
          const orderDateTime = new Date(order.CreatedAt);

          return (
            <div
              key={order.OrderID}
              className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-100
                ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                transition-all duration-500`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <FaReceipt className="text-red-600" />
                    <h3 className="font-semibold text-lg">Order #{order.OrderID}</h3>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <FaCalendarAlt className="text-gray-400" />
                    {orderDateTime.toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                  <span className="font-bold text-gray-800 flex items-center gap-1">
                    <FaRupeeSign /> ₹{order.Amount}
                  </span>
                </div>
              </div>

              <div className="p-6">
                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <FaShoppingBag className="text-gray-500" /> Order Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-lg hover:bg-gray-50">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-800">{item.name}</h5>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Qty: {item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-500" /> Delivery Address
                    </h4>
                    <p className="text-gray-600">
                      {user?.HouseNo}, {user?.Street}, {user?.Landmark}, {user?.City}, {user?.State} - {user?.Pincode}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                      <FaClock className="text-gray-500" /> Delivery Info
                    </h4>
                    <p className="text-gray-600">Order Time: {orderDateTime.toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderHistory;
