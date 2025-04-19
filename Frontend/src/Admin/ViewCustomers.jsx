import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    FaUserShield, FaUserAlt, FaPhoneAlt, FaEnvelope,
    FaMapMarkerAlt, FaUsers, FaSearch, FaArrowLeft
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Context/ToastContext";

const ViewCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [actionType, setActionType] = useState("");
    const navigate = useNavigate();
    const { showToast } = useToast();
    const user = JSON.parse(localStorage.getItem("current_user"));
    const isSuperAdmin = user?.Email === "vrandacodz@gmail.com";

    const handleAdminChange = async (email, makeAdmin = true) => {
        try {
            const res = await fetch(`http://localhost:5000/api/admin/${makeAdmin ? "promote" : "demote"}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ emailToPromote: email }),
            });

            const data = await res.json();
            if (res.ok) {
                showToast(data.message, "success");
                setCustomers((prev) =>
                    prev.map((c) => c.Email === email ? { ...c, IsAdmin: makeAdmin } : c)
                );
            } else {
                showToast(data.error || "Failed to update admin status", "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Server error updating admin status", "error");
        } finally {
            setSelectedEmail(null);
        }
    };

    const confirmAction = (email, type) => {
        setSelectedEmail(email);
        setActionType(type);
    };

    useEffect(() => {
        fetch("http://localhost:5000/api/admin/customers", {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("current_user"))?.token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => setCustomers(data))
            .catch((err) => console.error("Failed to fetch customers:", err));
    }, []);

    const filtered = customers.filter(cust =>
        cust.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cust.Phone && cust.Phone.includes(searchTerm))
    );

    const renderCard = (cust) => (
        <motion.div
            key={cust.CustomerID}
            className={`rounded-xl border shadow-md p-5 hover:shadow-lg transition bg-white border-${cust.IsAdmin ? 'red' : 'yellow'}-200`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
                {cust.IsAdmin ? <FaUserShield className="text-red-500" /> : <FaUserAlt className="text-yellow-500" />}
                {cust.Name}
            </div>
            <div className="text-sm text-gray-700 space-y-2">
                <p className="flex items-center gap-2">
                    <FaEnvelope className="text-gray-500" /> {cust.Email}
                </p>
                <p className="flex items-center gap-2">
                    <FaPhoneAlt className="text-gray-500" /> {cust.Phone || "N/A"}
                </p>
                <p className="flex items-start gap-2">
                    <FaMapMarkerAlt className="text-gray-500 mt-1" />
                    <span>{cust.HouseNo}, {cust.Street}, {cust.Landmark},<br />{cust.City}, {cust.State} - {cust.Pincode}</span>
                </p>
            </div>
            {isSuperAdmin && cust.Email !== "vrandacodz@gmail.com" && (
                <button
                    onClick={() => confirmAction(cust.Email, cust.IsAdmin ? "remove" : "add")}
                    className={`mt-3 text-xs px-3 py-1 rounded-full text-white transition ${cust.IsAdmin ? "bg-gray-500 hover:bg-gray-600" : "bg-yellow-500 hover:bg-yellow-600"}`}
                >
                    {cust.IsAdmin ? "Remove Admin" : "Promote to Admin"}
                </button>
            )}

        </motion.div>
    );

    return (
        <motion.div
            className="p-8 max-w-7xl mx-auto relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <button
                onClick={() => navigate(-1)}
                className="absolute top-4 right-4 text-sm bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg shadow"
            >
                <FaArrowLeft className="inline mr-1" /> Back
            </button>

            <div className="text-center w-full mb-8">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
                    <FaUsers className="text-red-500" /> Registered Users
                </h2>
            </div>

            <div className="w-full flex justify-center mb-6">
                <div className="flex max-w-md items-center gap-2 px-3 py-2 border rounded-lg bg-white focus-within:ring-2 focus-within:ring-red-400">
                    <FaSearch className="text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or phone..."
                        className="outline-none text-sm w-full"
                    />
                </div>
            </div>

            {customers.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">No registered customers found.</p>
            ) : (
                <div className="space-y-12">
                    {/* Admins Section */}
                    {filtered.filter(c => c.IsAdmin).length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-md">
                            <h3 className="text-2xl font-extrabold text-red-600 mb-6 text-center flex items-center justify-center gap-2">
                                <FaUserShield className="text-red-500" />
                                Admins
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
                                {filtered.filter(c => c.IsAdmin).map(renderCard)}
                            </div>
                        </div>
                    )}

                    {/* Customers Section */}
                    {filtered.filter(c => !c.IsAdmin).length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-md">
                            <h3 className="text-2xl font-extrabold text-yellow-600 mb-6 text-center flex items-center justify-center gap-2">
                                <FaUsers className="text-yellow-500" />
                                Customers
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
                                {filtered.filter(c => !c.IsAdmin).map(renderCard)}
                            </div>
                        </div>
                    )}
                </div>
            )}


            {/* Confirmation Modal */}
            {selectedEmail && (
                <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
                    <motion.div
                        className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl text-center"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            {actionType === "add" ? "Promote this user to Admin?" : "Remove Admin access?"}
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">{selectedEmail}</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => handleAdminChange(selectedEmail, actionType === "add")}
                                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
                            >
                                Yes, Confirm
                            </button>
                            <button
                                onClick={() => setSelectedEmail(null)}
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default ViewCustomers;
