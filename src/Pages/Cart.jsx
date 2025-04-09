import React from "react";
import { useCart } from "../Context/CartContext";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-24 text-center px-4">
        <FaShoppingCart className="text-6xl text-gray-400 mb-4" />
        <h2 className="text-xl text-gray-600 mb-2">Your cart is empty.</h2>
        <p className="text-sm text-gray-500 mb-6">
          Looks like you haven’t added anything to your cart yet.
        </p>
        <Link
          to="/menu"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition shadow"
        >
          Explore Menu 🍽️
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-red-600">Your Cart</h1>
      <div className="space-y-6">
        {cart.map((item) => (
          <div key={item.id} className="flex gap-4 items-center border-b pb-4">
            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-gray-600">₹{item.price} x {item.quantity}</p>
              <div className="mt-2 flex gap-2">
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <span className="px-3 py-1 border rounded">{item.quantity}</span>
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
                <button
                  className="ml-4 text-sm text-red-600 underline"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-right">
        <p className="text-lg font-semibold mb-2">Total: ₹{total.toFixed(2)}</p>
        <button
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          onClick={clearCart}
        >
          Clear Cart
        </button>
      </div>

      {cart.length > 0 && (
  <button
    onClick={() => navigate("/payment")}
    className="mt-6 w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 transition"
  >
    Proceed to Payment
  </button>
)}
    </div>
  );
};

export default Cart;