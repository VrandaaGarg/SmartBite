import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaList,
  FaUsers,
  FaShoppingBag,
  FaTools,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../Context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-8 md:py-16 flex flex-col gap-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-red-600 mb-3 flex justify-center items-center gap-2">
          <FaTools /> Admin Dashboard
        </h1>
        <p className="text-gray-700 text-md md:text-lg max-w-3xl mx-auto leading-relaxed">
          Welcome back,{" "}
          <span className="font-semibold text-yellow-600">{user?.Name}</span>!
          Here's a quick overview of what you can do as an administrator. Use
          the cards below to efficiently manage dishes, view orders, monitor
          customers, and keep your SmartBite system running smoothly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        <AdminCard
          to="/admin/add-dish"
          icon={<FaPlus />}
          title="Add Dish"
          desc="Add new dishes with details."
        />
        <AdminCard
          to="/admin/manage-dishes"
          icon={<FaList />}
          title="Manage Dishes"
          desc="Edit or remove dishes."
        />
        <AdminCard
          to="/admin/orders"
          icon={<FaShoppingBag />}
          title="Orders"
          desc="Track and manage orders."
        />
        <AdminCard
          to="/admin/customers"
          icon={<FaUsers />}
          title="Customers"
          desc="View and manage users."
        />
      </div>
    </motion.div>
  );
};

const AdminCard = ({ to, icon, title, desc }) => (
  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
    <Link
      to={to}
      className="bg-white border border-gray-200 rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center hover:border-red-400 hover:shadow-xl hover:bg-yellow-50 transition-all duration-300 group min-h-[180px]"
    >
      <div className="text-4xl text-red-500 mb-3 group-hover:text-yellow-600 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-800 group-hover:text-red-600">
        {title}
      </h3>
      <p className="text-sm text-gray-500 mt-1 px-2 leading-snug">{desc}</p>
    </Link>
  </motion.div>
);

export default AdminDashboard;
