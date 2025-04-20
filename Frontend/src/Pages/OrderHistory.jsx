import React, { useState, useEffect } from "react";
import { useOrder } from "../Context/OrderContext";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaShoppingBag,
  FaReceipt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaRupeeSign,
  FaEdit,
  FaUtensils,
  FaBoxOpen
} from "react-icons/fa";
import ReviewModal from "../Components/ReviewModal";
import { FaStar } from "react-icons/fa";

const OrderHistory = () => {
  const { orders, fetchOrders } = useOrder();
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [reviewModal, setReviewModal] = useState(null);
  
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

    if (diff < 30) return { 
      label: "Preparing", 
      color: "bg-blue-100 text-blue-800 border border-blue-200",
      icon: <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse inline-block mr-1"></span>
    };
    if (diff < 60) return { 
      label: "Out for Delivery", 
      color: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      icon: <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse inline-block mr-1"></span>
    };
    return { 
      label: "Delivered", 
      color: "bg-green-100 text-green-800 border border-green-200",
      icon: <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-1"></span>
    };
  };

  if (!orders || orders.length === 0) {
    return (
      <motion.div 
        className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16" 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center max-w-md mx-auto">
          <div className="bg-gray-50 w-28 h-28 flex items-center justify-center rounded-full mx-auto mb-6 shadow-inner">
            <FaBoxOpen className="text-6xl text-gray-300" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">No Orders Yet</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Looks like you haven't placed any orders with us yet. Browse our delicious menu and treat yourself!
          </p>
          <Link
            to="/menu"
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-full font-medium transition-all shadow-md hover:shadow-lg inline-flex items-center"
          >
            <FaUtensils className="mr-2" /> Browse Our Menu
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
      <motion.div 
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-yellow-500">
            Your Order History
          </span>
        </h1>
        <p className="text-gray-600">Keep track of all your delicious meals and reviews</p>
      </motion.div>

      {reviewModal && (
        <ReviewModal
          dishId={reviewModal.dishId}
          existingReview={reviewModal.existingReview}
          onClose={() => setReviewModal(null)}
        />
      )}

      <div className="space-y-8">
        {orders.map((order, index) => {
          const status = getStatusBadge(order.CreatedAt);
          const orderDateTime = new Date(order.CreatedAt);

          return (
            <motion.div
              key={order.OrderID}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: isLoaded ? 1 : 0, 
                y: isLoaded ? 0 : 30 
              }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1 
              }}
            >
              <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-50 p-2 rounded-lg border border-red-100">
                      <FaReceipt className="text-red-500 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">Order #{order.OrderID}</h3>
                      <div className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                        <FaCalendarAlt className="text-gray-400" />
                        {orderDateTime.toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}{' '}
                        <span className="mx-1">•</span>
                        <FaClock className="text-gray-400" />
                        {orderDateTime.toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <span className={`text-sm font-medium px-3 py-1.5 rounded-full flex items-center whitespace-nowrap ${status.color}`}>
                      {status.icon} {status.label}
                    </span>
                    <span className="font-bold text-gray-800 flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
                      <FaRupeeSign className="text-yellow-600" /> ₹{order.Amount}
                    </span>
                  </div>
                </div>
              </div>
  
              <div className="p-6">
                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="text-gray-700 font-medium mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                    <FaShoppingBag className="text-red-500" /> Order Items
                  </h4>
                
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {order.items?.map((item, i) => (
                      <div 
                        key={i} 
                        className="flex gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 border border-gray-100"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg shadow-sm"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
                          }}
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-800 mb-1">{item.name}</h5>
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span className="bg-white px-2 py-0.5 rounded border border-gray-200">Qty: {item.quantity}</span>
                            <span className="font-semibold text-red-600">₹{item.price * item.quantity}</span>
                          </div>

                          {item.review ? (
                            <div className="bg-white p-2 rounded-lg border border-gray-200 mt-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <FaStar
                                      key={i}
                                      className={`text-sm ${i < item.review.Rating ? "text-yellow-400" : "text-gray-200"}`}
                                    />
                                  ))}
                                </div>
                                <button
                                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded flex items-center gap-1"
                                  onClick={() =>
                                    setReviewModal({
                                      dishId: item.DishID || item.id,
                                      existingReview: item.review || null,
                                    })
                                  }
                                >
                                  <FaEdit size={10} /> Edit
                                </button>
                              </div>
                              <p className="text-xs text-gray-500 italic mt-1 line-clamp-2">"{item.review.Comment}"</p>
                            </div>
                          ) : (
                            <button
                              className="mt-2 text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg border border-red-100 transition-colors w-full flex items-center justify-center gap-1.5"
                              onClick={() => setReviewModal({ dishId: item.DishID || item.id })}
                            >
                              <FaStar size={12} /> Write a Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm pt-4 border-t border-gray-100">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-red-500" /> Delivery Address
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {user?.HouseNo}, {user?.Street}, {user?.Landmark}, {user?.City}, {user?.State} - {user?.Pincode}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                      <FaClock className="text-red-500" /> Delivery Information
                    </h4>
                    <p className="text-gray-600">
                      {status.label === "Delivered" 
                        ? "Your order has been delivered." 
                        : status.label === "Out for Delivery"
                        ? "Your order is on the way!"
                        : "Your order is being prepared by our chefs."}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {status.label !== "Delivered" && "Estimated delivery time: 30-45 minutes"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderHistory;
