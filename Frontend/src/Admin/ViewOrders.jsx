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
        fetch("http://localhost:5000/api/admin/orders", {
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
            className="p-8 max-w-5xl mx-auto relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >

            <div className="mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute right-0 flex items-center gap-2 px-4 py-2 text-white bg-red-500 hover:bg-red-600 transition rounded-lg"
                >
                    <IoArrowBack size={20} /> Back
                </button>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <FaSort className="text-red-500" /> All Orders
                </h2>
                
            </div>
            <div className="flex flex-col md:flex-row gap-3 items-start justify-center md:items-center my-4">
                    <div className="flex items-center gap-2">
                        <FaSearch className="text-gray-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder="Search by customer..."
                            className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-500" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                        />
                    </div>
                </div>
            

            {filteredOrders.length === 0 ? (
                <p className="text-gray-500">No matching orders found.</p>
            ) : (
                <div className="space-y-6">
                    {filteredOrders.map((order) => (
                        <motion.div
                            key={order.OrderID}
                            className="bg-white border border-red-200 rounded-2xl shadow-sm px-6 py-5 hover:shadow-md transition-all duration-300"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                                <div className="text-sm text-gray-700 flex flex-col md:flex-row md:items-center gap-3">
                                    <span className="flex items-center gap-2">
                                        <FaClock className="text-red-500" />
                                        {new Date(order.CreatedAt).toLocaleString()}
                                    </span>
                                    <span className="flex items-center gap-2 text-yellow-600 font-bold">
                                        <FaRupeeSign className="text-yellow-600" /> ₹{order.TotalAmount}
                                    </span>
                                </div>
                                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                                    Order #{order.OrderID}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800 mb-4">
                                <div className="space-y-2">
                                    <h3 className="text-base font-semibold text-gray-800 mb-1">Customer Info</h3>
                                    <p className="flex items-center gap-2">
                                        <FaUserCircle className="text-red-400" />
                                        <span>{order.Customer.Name} (ID: {order.Customer.CustomerID})</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaEnvelope className="text-red-400" /> {order.Customer.Email}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaPhone className="text-red-400" /> {order.Customer.Phone}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-red-400" /> {order.Customer.Address}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-base font-semibold text-gray-800 mb-2">Ordered Dishes</h3>
                                    <ul className="space-y-2">
                                        {order.Dishes.map((dish, idx) => (
                                            <li
                                                key={idx}
                                                className="flex justify-between bg-yellow-50 border border-yellow-100 rounded-lg px-4 py-2 text-gray-700 shadow-sm"
                                            >
                                                <span className="font-medium">{dish.Name} × {dish.Quantity}</span>
                                                <span className="text-red-500 font-semibold">₹{dish.Total}</span>
                                            </li>
                                        ))}
                                    </ul>
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
