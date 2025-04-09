import React, { useState } from "react";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";
import { useOrder } from "../Context/OrderContext";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrder();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    if (!user || cart.length === 0) return;

    const newOrder = {
      userId: user.id,
      items: cart,
      totalAmount,
      paymentMethod,
      address: user.address,
    };

    const placedOrder = placeOrder(newOrder);
    clearCart();

    // Navigate to order success page with state
    navigate("/order-success", { state: { order: placedOrder } });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">
        Checkout & Payment
      </h2>

      {/* Cart Summary */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Your Items:</h3>
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between py-2 border-b text-gray-700"
          >
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-lg mt-4">
          <span>Total:</span>
          <span>₹{totalAmount}</span>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Delivery Address:</h3>
        <p className="text-gray-600">{user?.address}</p>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Select Payment Method:</h3>
        <div className="space-y-2 text-gray-700">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            Cash on Delivery
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="upi"
              checked={paymentMethod === "upi"}
              onChange={() => setPaymentMethod("upi")}
            />
            UPI (Mock Payment)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
            />
            Credit/Debit Card (Mock)
          </label>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 transition"
      >
        Place Order
      </button>
    </div>
  );
};

export default Payment;