import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUserShield, FaUserAlt, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaUsers, FaSearch, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ViewCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

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

    const admins = customers.filter(c => c.IsAdmin);
    const users = customers.filter(c => !c.IsAdmin);

    const filteredAdmins = admins.filter(cust =>
        cust.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cust.Phone && cust.Phone.includes(searchTerm))
    );

    const filteredUsers = users.filter(cust =>
        cust.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cust.Phone && cust.Phone.includes(searchTerm))
    );

    const renderCard = (cust, isAdmin) => (
        <motion.div
            key={cust.CustomerID}
            className={`rounded-xl border shadow-md p-5 hover:shadow-lg transition bg-white border-${isAdmin ? 'red' : 'yellow'}-200`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
                {isAdmin ? <FaUserShield className="text-red-500" /> : <FaUserAlt className="text-yellow-500" />}
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
                    <span>
                        {cust.HouseNo}, {cust.Street}, {cust.Landmark},<br />
                        {cust.City}, {cust.State} - {cust.Pincode}
                    </span>
                </p>
            </div>
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
    <FaUsers className="text-red-500" />
    Registered Users
  </h2>
</div>


            <div className="w-full flex justify-center mb-6">
                <div className="flex max-w-md  items-center gap-2 px-3 py-2 border rounded-lg bg-white focus-within:ring-2 focus-within:ring-red-400">
                    <FaSearch className="text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or phone..."
                        className=" outline-none text-sm w-full"
                    />
                </div>
            </div>

            {customers.length === 0 ? (
                <p className="text-gray-500">No registered customers found.</p>
            ) : (
                <>
                    {filteredAdmins.length > 0 && (
                        <div className="mb-10">
                            <h3 className="text-xl font-bold text-red-600 mb-4">Admins</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
                                {filteredAdmins.map(admin => renderCard(admin, true))}
                            </div>
                        </div>
                    )}

                    {filteredUsers.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold text-yellow-600 mb-4">Customers</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
                                {filteredUsers.map(user => renderCard(user, false))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </motion.div>
    );
};

export default ViewCustomers;
