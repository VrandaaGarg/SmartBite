import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaHome,
  FaInfoCircle,
} from "react-icons/fa";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const { confirmEmailVerification, user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error, already_verified
  const [message, setMessage] = useState("");

  // Separate effect to watch for user verification status changes
  useEffect(() => {
    if (user && user.emailVerification && status === "verifying") {
      setStatus("success");
      setMessage("Your email has been verified successfully!");
      setTimeout(() => {
        navigate("/profile");
      }, 3000);
    }
  }, [user, status, navigate]);

  useEffect(() => {
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    // Check if user is already verified
    if (user && user.emailVerification) {
      setStatus("already_verified");
      setMessage("Your email is verified!");
      setTimeout(() => {
        navigate("/profile");
      }, 3000);
      return;
    }

    if (!userId || !secret) {
      setStatus("error");
      setMessage("Invalid verification link. Missing required parameters.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const result = await confirmEmailVerification(userId, secret);
        if (result.success) {
          // Don't set status here - let the user effect handle it
          // The user state will be updated by the AuthContext
        } else {
          setStatus("error");
          // Better error handling for common scenarios
          if (result.message && result.message.includes("Invalid token")) {
            setMessage(
              "This verification link has expired or has already been used. If you need a new verification link, please request one from your profile."
            );
          } else {
            setMessage(result.message || "Email verification failed.");
          }
        }
      } catch (error) {
        setStatus("error");
        // Handle specific Appwrite errors
        if (error.message && error.message.includes("Invalid token")) {
          setMessage(
            "This verification link has expired or has already been used. If your email is not verified, please request a new verification link from your profile."
          );
        } else {
          setMessage(
            "An error occurred during verification. Please try again."
          );
        }
      }
    };

    verifyEmail();
  }, [searchParams, confirmEmailVerification, navigate, user]);

  const getStatusIcon = () => {
    switch (status) {
      case "verifying":
        return <FaSpinner className="text-6xl text-blue-600 animate-spin" />;
      case "success":
        return <FaCheckCircle className="text-6xl text-green-600" />;
      case "already_verified":
        return <FaInfoCircle className="text-6xl text-blue-600" />;
      case "error":
        return <FaTimesCircle className="text-6xl text-red-600" />;
      default:
        return <FaSpinner className="text-6xl text-blue-600 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "verifying":
        return "from-blue-50 to-blue-100";
      case "success":
        return "from-green-50 to-green-100";
      case "already_verified":
        return "from-blue-50 to-indigo-100";
      case "error":
        return "from-red-50 to-red-100";
      default:
        return "from-blue-50 to-blue-100";
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case "verifying":
        return "Verifying Your Email...";
      case "success":
        return "Email Verified!";
      case "already_verified":
        return "Already Verified";
      case "error":
        return "Verification Failed";
      default:
        return "Verifying Your Email...";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center py-8 px-4">
      <motion.div
        className={`max-w-md w-full bg-gradient-to-br ${getStatusColor()} rounded-2xl shadow-xl p-8 text-center`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        >
          {getStatusIcon()}
        </motion.div>

        <motion.h1
          className="text-2xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {getStatusTitle()}
        </motion.h1>

        <motion.p
          className="text-gray-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {message || "Please wait while we verify your email address..."}
        </motion.p>

        {(status === "success" || status === "already_verified") && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="text-sm text-gray-500">
              Redirecting to your profile in 3 seconds...
            </p>
            <Link
              to="/profile"
              className={`inline-flex items-center gap-2 ${
                status === "success"
                  ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              } text-white px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg`}
            >
              <FaHome />
              Go to Profile
            </Link>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="space-y-3">
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg"
              >
                <FaHome />
                Back to Profile
              </Link>
              <p className="text-sm text-gray-500">
                You can request a new verification email from your profile if
                needed.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
