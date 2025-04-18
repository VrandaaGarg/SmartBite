import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaUtensils, FaPlus, FaList, FaUsers, FaShoppingBag, FaBars, FaTimes,
} from "react-icons/fa";

const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar (Responsive) */}
      <div
        className={`bg-red-600 text-white w-64 p-6 space-y-6 
          fixed top-0 left-0 h-screen z-40 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}
      >
        {/* Close button (Mobile) */}
        <div className="md:hidden flex justify-end">
          <button onClick={() => setSidebarOpen(false)}>
            <FaTimes size={20} />
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6">SmartBite Admin</h2>

        <nav className="space-y-3">
          <Link
            to="/admin/add-dish"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              isActive("add-dish") ? "bg-white text-red-600" : "hover:bg-red-500"
            }`}
          >
            <FaPlus /> Add Dish
          </Link>
          <Link
            to="/admin/manage-dishes"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              isActive("manage-dishes") ? "bg-white text-red-600" : "hover:bg-red-500"
            }`}
          >
            <FaList /> Manage Dishes
          </Link>
          <Link
            to="/admin/orders"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              isActive("orders") ? "bg-white text-red-600" : "hover:bg-red-500"
            }`}
          >
            <FaShoppingBag /> View Orders
          </Link>
          <Link
            to="/admin/customers"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              isActive("customers") ? "bg-white text-red-600" : "hover:bg-red-500"
            }`}
          >
            <FaUsers /> View Customers
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 bg-gray-50 min-h-screen">
        {/* Top Bar for mobile toggle */}
        <div className="md:hidden bg-red-600 text-white px-4 py-3 flex justify-between items-center shadow">
          <h1 className="text-lg font-bold">SmartBite Admin</h1>
          <button onClick={() => setSidebarOpen(true)}>
            <FaBars size={20} />
          </button>
        </div>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
