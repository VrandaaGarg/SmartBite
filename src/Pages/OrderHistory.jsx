import React from "react";
import { useOrder } from "../Context/OrderContext";

const OrderHistory = () => {
  const { orders } = useOrder();

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-600 text-xl">
        You haven't placed any orders yet.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">
        My Orders
      </h2>

      {orders.map((order) => (
        <div
          key={order.id}
          className="mb-6 border-b pb-4 rounded hover:bg-gray-50 transition"
        >
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Order ID: #{order.id}</span>
            <span>{new Date(order.createdAt).toLocaleString()}</span>
          </div>

          <div className="flex justify-between font-semibold text-gray-700">
            <span>Payment: {order.paymentMethod.toUpperCase()}</span>
            <span>Total: ₹{order.totalAmount}</span>
          </div>

          <div className="mt-2">
            <h4 className="font-medium text-gray-700 mb-1">Items:</h4>
            <ul className="text-gray-600 text-sm list-disc pl-6">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.name} × {item.quantity} — ₹{item.price * item.quantity}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-2 text-sm text-gray-600">
            <strong>Delivery to:</strong> {order.address}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;