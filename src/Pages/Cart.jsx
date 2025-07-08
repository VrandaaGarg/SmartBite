// Cart.jsx
import React, { useState, useEffect } from "react";
import { useCart } from "../Context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaTrashAlt,
  FaArrowRight,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import { MdOutlineFastfood } from "react-icons/md";
import { useToast } from "../Context/ToastContext"; // ✅

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, loading } =
    useCart();
  const navigate = useNavigate();
  const [animateItems, setAnimateItems] = useState(false);
  const [removingItem, setRemovingItem] = useState(null);
  const { showToast } = useToast(); // ✅

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const tax = subtotal > 0 ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + deliveryFee + tax;

  useEffect(() => {
    setAnimateItems(true);
  }, []);

  const handleRemoveItem = (id) => {
    setRemovingItem(id);
    setTimeout(() => {
      removeFromCart(id);
      setRemovingItem(null);
    }, 300);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 animate-fadeIn">
        <div className="text-center mb-6">
          <FaShoppingCart className="text-8xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            Looks like you haven't added anything to your cart yet. Browse our
            delicious menu and discover your new favorites.
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-lg gap-2"
          >
            <MdOutlineFastfood className="text-lg" />
            Explore Our Menu
          </Link>
        </div>
      </div>
    );
  }

  // if (loading) {
  //   return (
  //     <div className="min-h-[70vh] flex justify-center items-center">
  //       <p className="text-gray-500 text-lg animate-pulse">Loading your cart...</p>
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 pb-20">
      <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left mb-2 md:mb-6 text-red-600">
        Your Cart
      </h1>
      <p className="text-gray-500 text-center md:text-left mb-8">
        {cart.length} item(s) in your cart
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="lg:w-2/3 space-y-4">
          {cart.map((item, index) => (
            <div
              key={`${item.DishID}-${index}`} // ✅ guaranteed unique
              className={`bg-white rounded-xl shadow-md overflow-hidden flex flex-col sm:flex-row 
                ${
                  animateItems
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                } 
                ${
                  removingItem === item.DishID
                    ? "opacity-0 transform scale-95"
                    : ""
                }
                transition-all duration-300`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-full sm:w-32 h-32 bg-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {item.description || "Tasty and fresh"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.DishID)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    aria-label="Remove item"
                  >
                    <FaTrashAlt />
                  </button>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                      onClick={() => {
                        showToast("Updating quantity...", "info"); // 🟡 Toast immediately
                        updateQuantity(item.DishID, item.quantity - 1);
                      }}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="px-4 py-1 font-medium">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                      onClick={() => {
                        showToast("Updating quantity...", "info"); // 🟡 Toast immediately
                        updateQuantity(item.DishID, item.quantity + 1);
                      }}
                      aria-label="Increase quantity"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                  <div className="font-bold text-lg">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="md:flex justify-center md:justify-between pt-4">
            <button
              onClick={() => navigate("/menu")}
              className="flex items-center text-red-600 hover:text-red-700 font-medium transition"
            >
              <span className="mr-1">←</span> Continue Shopping
            </button>
            <button
              onClick={clearCart}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600 font-medium transition"
            >
              <FaTrashAlt size={14} />
              <span>Clear Cart</span>
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
              Order Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/payment")}
              className="mt-6 w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-4 rounded-lg font-semibold flex justify-center items-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              Proceed to Checkout
              <FaArrowRight />
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              Taxes and shipping calculated at checkout
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-yellow-700">
              <span className="font-semibold">🚚 Free delivery</span> on orders
              above ₹500
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
