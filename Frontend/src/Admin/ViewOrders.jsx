import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaRupeeSign, FaClock, FaUserCircle, FaSort, FaSearch, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const ViewOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5500/api/admin/orders", {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("current_user"))?.token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setOrders([...data].sort((a, b) => b.OrderID - a.OrderID));
                setFilteredOrders([...data].sort((a, b) => b.OrderID - a.OrderID));
            })
            .catch((err) => console.error("Failed to fetch orders:", err));
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearch(term);
        filterOrders(term, selectedDate);
    };

    const handleDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        filterOrders(search, date);
    };

    const filterOrders = (searchTerm, dateStr) => {
        const filtered = orders.filter((order) => {
            const matchesSearch =
                order.Customer.Name.toLowerCase().includes(searchTerm) ||
                order.Customer.Email.toLowerCase().includes(searchTerm);
            const matchesDate = dateStr
                ? new Date(order.CreatedAt).toLocaleDateString() === new Date(dateStr).toLocaleDateString()
                : true;
            return matchesSearch && matchesDate;
        });
        setFilteredOrders(filtered);
    };

    return (
        <motion.div
            className="p-6 md:p-8 max-w-6xl mx-auto relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute right-6 top-6 flex items-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition rounded-lg shadow-md"
                >
                    <IoArrowBack size={18} /> Back
                </button>
            </div>
            
            <div className="mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-yellow-500 flex items-center justify-center gap-3">
                    <FaSort className="text-red-500" /> All Orders
                </h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-8">
                <div className="flex items-center gap-2 px-4 py-3 border rounded-full bg-white shadow-sm transition-all w-full max-w-xs focus-within:shadow-md focus-within:ring-2 focus-within:ring-red-400">
                    <FaSearch className="text-red-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search by customer..."
                        className="outline-none text-sm w-full bg-transparent"
                    />
                </div>
                <div className="flex items-center gap-2 px-4 py-3 border rounded-full bg-white shadow-sm transition-all w-full max-w-xs focus-within:shadow-md focus-within:ring-2 focus-within:ring-red-400">
                    <FaCalendarAlt className="text-red-400" />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="outline-none text-sm w-full bg-transparent"
                    />
                </div>
            </div>
            
            {filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <FaSort className="text-6xl mb-4 text-gray-300" />
                    <p className="text-center text-lg">No matching orders found.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {filteredOrders.map((order) => (
                        <motion.div
                            key={order.OrderID}
                            className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg px-5 py-6 md:p-6 transition-all duration-300"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            whileHover={{ y: -3 }}
                        >
                            <div className="flex justify-between items-center mb-5 flex-wrap gap-3 border-b border-dashed border-gray-200 pb-4">
                                <div className="text-sm text-gray-700 flex flex-col md:flex-row md:items-center gap-3">
                                    <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                                        <FaClock className="text-red-500" />
                                        {new Date(order.CreatedAt).toLocaleString()}
                                    </span>
                                    <span className="flex items-center gap-2 font-bold text-base bg-yellow-50 px-3 py-1 rounded-full text-yellow-700">
                                        <FaRupeeSign /> ₹{order.TotalAmount}
                                    </span>
                                </div>
                                <span className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 text-sm font-medium px-4 py-1.5 rounded-full shadow-sm">
                                    Order #{order.OrderID}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-800">
                                <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
                                    <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">Customer Info</h3>
                                    <p className="flex items-center gap-2">
                                        <FaUserCircle className="text-red-400" />
                                        <span className="font-medium">{order.Customer.Name}</span> 
                                        <span className="text-xs text-gray-500">(ID: {order.Customer.CustomerID})</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaEnvelope className="text-red-400" /> {order.Customer.Email}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaPhone className="text-red-400" /> {order.Customer.Phone || "N/A"}
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <FaMapMarkerAlt className="text-red-400 mt-1" /> 
                                        <span className="text-gray-600">{order.Customer.Address || "No address provided"}</span>
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-base font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Ordered Dishes</h3>
                                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-red-200 scrollbar-track-gray-100">
                                        {order.Dishes.map((dish, idx) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between bg-gradient-to-r from-yellow-50 to-white border border-yellow-100 rounded-lg px-4 py-2.5 text-gray-700 shadow-sm"
                                            >
                                                <span className="font-medium">{dish.Name} <span className="text-gray-400">×{dish.Quantity}</span></span>
                                                <span className="text-red-500 font-semibold">₹{dish.Total}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default ViewOrders;
