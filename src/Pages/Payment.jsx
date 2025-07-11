import React, { useState } from "react";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../Context/OrderContext";

const Payment = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const { placeOrder } = useOrder();

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const tax = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + deliveryFee + tax;

  console.log(user);
  const handlePlaceOrder = async () => {
    if (!user || cart.length === 0) return;

    setLoading(true);
    try {
      const newOrder = {
        totalAmount,
        paymentMethod,
        address: `${user.houseNo ? user.houseNo : ""} ${
          user.street ? ", " + user.street : ""
        }${user.landmark ? ", " + user.landmark : ""}${
          user.city ? ", " + user.city : ""
        } ${user.state ? ", " + user.state : ""} - ${user.pincode}`,
        items: cart.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: parseFloat(item.price),
          DishID: item.DishID,
          image: item.image,
        })),
      };

      const placedOrder = await placeOrder(newOrder);
      if (placedOrder) {
        clearCart();
        navigate("/order-success", { state: { order: placedOrder } });
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      console.error("Order Error:", error);
      alert("Something went wrong while placing your order.");
    } finally {
      setLoading(false);
    }
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
            key={item.CartID || item.DishID}
            className="flex justify-between py-2 border-b text-gray-700"
          >
            <div className="flex gap-3 items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover"
              />
              <span>
                {item.name} × {item.quantity}
              </span>
            </div>
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
        <p className="text-gray-600">
          {user?.houseNo ? user?.houseNo + "," : ""}
          {user?.street ? user?.street + "," : ""}
          {user?.landmark ? user?.landmark + "," : ""}
          {user?.city ? user?.city + "," : ""} {user?.state}
          {user?.pincode ? " - " + user?.pincode : ""}
        </p>
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
        disabled={loading}
        className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 transition font-semibold"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default Payment;
