import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaUserShield,
  FaUserAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUsers,
  FaSearch,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Context/ToastContext";
import { useAuth } from "../Context/AuthContext";
import appwriteService from "../config/service";

const ViewCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [actionType, setActionType] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const isSuperAdmin = user?.isAdmin === true;

  const handleAdminChange = async (email, makeAdmin = true) => {
    try {
      const customer = customers.find((c) => c.Email === email);
      if (!customer) {
        showToast("Customer not found", "error");
        return;
      }

      // Update user admin status in Appwrite
      await appwriteService.updateUser(customer.CustomerID, {
        isAdmin: makeAdmin,
      });

      showToast(
        makeAdmin ? "User promoted to admin" : "Admin privileges removed",
        "success"
      );
      setCustomers((prev) =>
        prev.map((c) =>
          c.Email === email ? { ...c, IsAdmin: makeAdmin ? 1 : 0 } : c
        )
      );
    } catch (err) {
      console.error(err);
      showToast("Error updating admin status", "error");
    } finally {
      setSelectedEmail(null);
    }
  };

  const confirmAction = (email, type) => {
    setSelectedEmail(email);
    setActionType(type);
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const userData = await appwriteService.getAllUsers();

        // Transform data to match expected format
        const transformedUsers = userData.map((user) => {
          const addressParts = [
            user.houseNo || "",
            user.street ? ", " + user.street : "",
            user.landmark ? ", " + user.landmark : "",
            user.city ? ", " + user.city : "",
            user.state ? ", " + user.state : "",
          ];

          const address =
            addressParts.join("").trim() +
            (user.pincode ? ` (${user.pincode})` : "");

          return {
            ...user,
            CustomerID: user.$id,
            Name: user.name || user.Name,
            Email: user.email || user.Email,
            Phone: user.phone || user.Phone,
            Address: address,
            IsAdmin: user.isAdmin ? 1 : 0,
            CreatedAt: user.createdAt || user.$createdAt,
          };
        });

        console.log(transformedUsers);
        setCustomers(transformedUsers);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
        showToast("Failed to load customers", "error");
      }
    };

    fetchCustomers();
  }, [showToast]);

  const filtered = customers.filter(
    (cust) =>
      cust.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cust.Phone && cust.Phone.includes(searchTerm))
  );

  const renderCard = (cust) => (
    <motion.div
      key={cust.CustomerID}
      className={`rounded-xl border bg-white shadow-md hover:shadow-lg p-6 transition-all duration-300 ${
        cust.IsAdmin
          ? "border-red-200 bg-gradient-to-br from-white to-red-50"
          : "border-yellow-200 bg-gradient-to-br from-white to-yellow-50"
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3 pb-2 border-b border-dashed border-gray-200">
        {cust.IsAdmin ? (
          <FaUserShield className="text-red-500 text-xl" />
        ) : (
          <FaUserAlt className="text-yellow-500 text-xl" />
        )}
        {cust.Name}
      </div>
      <div className="text-sm text-gray-700 space-y-3">
        <p className="flex items-center gap-2">
          <FaEnvelope className="text-gray-500 min-w-[16px]" />
          <span className="truncate">{cust.Email}</span>
        </p>
        <p className="flex items-center gap-2">
          <FaPhoneAlt className="text-gray-500 min-w-[16px]" />
          <span>{cust.Phone || "N/A"}</span>
        </p>
        <p className="flex items-start gap-2">
          <FaMapMarkerAlt className="text-gray-500 min-w-[16px] mt-1" />
          <span className="text-gray-600">{cust.Address}</span>
        </p>
      </div>

      {/* Promote and demote button */}
      {isSuperAdmin && cust.email !== "hi@vrandagarg.in" && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() =>
              confirmAction(cust.Email, cust.IsAdmin ? "remove" : "add")
            }
            className={`w-full text-sm px-4 py-2 rounded-lg text-white transition-all transform hover:scale-[1.02] ${
              cust.IsAdmin
                ? "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700"
                : "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600"
            }`}
          >
            {cust.IsAdmin ? "Remove Admin" : "Promote to Admin"}
          </button>
        </div>
      )}
    </motion.div>
  );

  return (
    <motion.div
      className="p-6 md:p-8 max-w-7xl mx-auto relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <button
        onClick={() => navigate(-1)}
        className="absolute top-2 md:top-4 right-4 text-sm bg-red-500 hover:bg-red-600 text-white font-medium px-2 md:px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-2"
      >
        <FaArrowLeft /> <span className="hidden md:block">Back</span>
      </button>

      <div className="text-center w-full mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
          <FaUsers className="text-red-500" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-yellow-500">
            Registered Users
          </span>
        </h2>
      </div>

      <div className="w-full flex justify-center mb-8">
        <div className="flex max-w-md w-full items-center gap-2 px-4 py-3 border rounded-full bg-white shadow-sm transition-all focus-within:shadow-md focus-within:ring-2 focus-within:ring-red-400">
          <FaSearch className="text-red-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or phone..."
            className="outline-none text-sm w-full bg-transparent"
          />
        </div>
      </div>

      {customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <FaUsers className="text-6xl mb-4 text-gray-300" />
          <p className="text-center text-lg">No registered customers found.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Admins Section */}
          {filtered.filter((c) => c.IsAdmin).length > 0 && (
            <div className="bg-gradient-to-br from-red-50 to-white border border-red-200 rounded-2xl p-6 shadow-lg">
              <h3 className="text-2xl font-extrabold text-red-600 mb-6 text-center flex items-center justify-center gap-2">
                <FaUserShield className="text-red-500" />
                Admins
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 justify-center">
                {filtered.filter((c) => c.IsAdmin).map(renderCard)}
              </div>
            </div>
          )}

          {/* Customers Section */}
          {filtered.filter((c) => !c.IsAdmin).length > 0 && (
            <div className="bg-gradient-to-br from-yellow-50 to-white border border-yellow-200 rounded-2xl p-6 shadow-lg">
              <h3 className="text-2xl font-extrabold text-yellow-600 mb-6 text-center flex items-center justify-center gap-2">
                <FaUsers className="text-yellow-500" />
                Customers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 justify-center">
                {filtered.filter((c) => !c.IsAdmin).map(renderCard)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <motion.div
            className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-sm shadow-2xl border border-gray-100"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {actionType === "add"
                ? "Promote this user to Admin?"
                : "Remove Admin access?"}
            </h3>
            <p className="text-sm text-gray-600 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
              {selectedEmail}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setSelectedEmail(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleAdminChange(selectedEmail, actionType === "add")
                }
                className={`px-5 py-2 rounded-lg text-white font-medium ${
                  actionType === "add"
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                Yes, Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ViewCustomers;
