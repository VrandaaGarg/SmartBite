import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./Pages/Home";
import Menu from "./Pages/Menu";
import Cart from "./Pages/Cart";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Profile from "./Pages/Profile";
import ProtectedRoute from "./Context/ProtectedRoute";
import { AuthProvider } from "./Context/AuthContext";
import "./index.css";
import { CartProvider } from "./Context/CartContext";
import { ToastProvider } from "./Context/ToastContext";
import About from "./Pages/About";
import Payment from "./Pages/Payment";
import OrderSuccess from "./Pages/OrderSuccess";
import CustomerService from "./Pages/CustomerService";
import { OrderProvider } from "./Context/OrderContext";
import OrderHistory from "./Pages/OrderHistory";

import AdminDashboard from "./Admin/AdminDashboard";
import AddDish from "./Admin/AddDish";
import ManageDishes from "./Admin/ManageDishes";
import ViewCustomers from "./Admin/ViewCustomers";
import ViewOrders from "./Admin/ViewOrders";
import ProtectedAdminRoute from "./Context/ProtectedAdminRoute";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>

          <CartProvider>
            <OrderProvider>
              <Routes>
                {/* 🌐 Public/Protected User Routes */}
                <Route path="/" element={<App />}>
                  <Route index element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/support" element={<CustomerService />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/orders" element={<OrderHistory />} />
                </Route>

                {/* ✅ Admin Routes (Separate from "/" layout) */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedAdminRoute>
                      <App />
                    </ProtectedAdminRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="add-dish" element={<AddDish />} />
                  <Route path="manage-dishes" element={<ManageDishes />} />
                  <Route path="orders" element={<ViewOrders />} />
                  <Route path="customers" element={<ViewCustomers />} />
                </Route>


              </Routes>

            </OrderProvider>
          </CartProvider>

        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
