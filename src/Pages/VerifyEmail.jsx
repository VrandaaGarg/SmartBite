import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaHome,
  FaEnvelope,
  FaShieldAlt,
  FaExclamationTriangle,
  FaRedo,
  FaArrowRight,
  FaUserCheck,
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
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <FaSpinner className="text-2xl md:text-3xl lg:text-4xl text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-ping opacity-20"></div>
          </motion.div>
        );
      case "success":
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="relative"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <FaCheckCircle className="text-2xl md:text-3xl lg:text-4xl text-white" />
            </div>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute inset-0 bg-green-400 rounded-full"
            ></motion.div>
          </motion.div>
        );
      case "already_verified":
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 150 }}
            className="relative"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <FaUserCheck className="text-2xl md:text-3xl lg:text-4xl text-white" />
            </div>
          </motion.div>
        );
      case "error":
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 150 }}
            className="relative"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <FaTimesCircle className="text-2xl md:text-3xl lg:text-4xl text-white" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-red-400 rounded-full opacity-20"
            ></motion.div>
          </motion.div>
        );
      default:
        return (
          <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <FaSpinner className="text-2xl md:text-3xl lg:text-4xl text-white animate-spin" />
          </div>
        );
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "verifying":
        return "from-blue-50 via-blue-100 to-indigo-50";
      case "success":
        return "from-green-50 via-emerald-100 to-green-50";
      case "already_verified":
        return "from-blue-50 via-indigo-100 to-purple-50";
      case "error":
        return "from-red-50 via-rose-100 to-red-50";
      default:
        return "from-blue-50 via-blue-100 to-indigo-50";
    }
  };

  const getStatusBorder = () => {
    switch (status) {
      case "verifying":
        return "border-blue-200";
      case "success":
        return "border-green-200";
      case "already_verified":
        return "border-indigo-200";
      case "error":
        return "border-red-200";
      default:
        return "border-blue-200";
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 bg-red-200 rounded-full opacity-20"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-32 right-16 w-16 h-16 bg-orange-200 rounded-full opacity-20"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-24 h-24 bg-yellow-200 rounded-full opacity-20"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 2 }}
        />
      </div>

      <motion.div
        className={`relative max-w-sm sm:max-w-md lg:max-w-lg w-full bg-gradient-to-br ${getStatusColor()} ${getStatusBorder()} border-2 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 text-center backdrop-blur-sm`}
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        {/* Status Icon */}
        <motion.div
          className="mb-6 sm:mb-8 flex justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            type: "spring",
            stiffness: 150,
          }}
        >
          {getStatusIcon()}
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {getStatusTitle()}
        </motion.h1>

        {/* Message */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
            {message || "Please wait while we verify your email address..."}
          </p>

          {/* Additional context based on status */}
          {status === "verifying" && (
            <motion.div
              className="mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm text-blue-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <FaShieldAlt className="animate-pulse" />
              <span>Securing your account...</span>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              className="mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm text-green-600"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
            >
              <FaEnvelope />
              <span>Your email is now verified!</span>
            </motion.div>
          )}
        </motion.div>

        {/* Success Actions */}
        <AnimatePresence>
          {(status === "success" || status === "already_verified") && (
            <motion.div
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {/* Countdown */}
              <motion.div
                className="bg-white/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <p className="text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-2">
                  <FaArrowRight className="animate-pulse" />
                  <span>Redirecting to your profile in 3 seconds...</span>
                </p>
              </motion.div>

              {/* Action Button */}
              <Link
                to="/profile"
                className={`group inline-flex items-center justify-center gap-2 w-full sm:w-auto ${
                  status === "success"
                    ? "bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
                    : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                } text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-medium text-sm sm:text-base transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg`}
              >
                <FaHome className="group-hover:animate-bounce" />
                <span>Go to Profile</span>
                <FaArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Actions */}
        <AnimatePresence>
          {status === "error" && (
            <motion.div
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {/* Error Info */}
              <motion.div
                className="bg-red-50/80 backdrop-blur-sm rounded-lg p-4 sm:p-5 border border-red-200/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-start gap-3">
                  <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <h3 className="text-sm sm:text-base font-semibold text-red-800 mb-1">
                      Verification Failed
                    </h3>
                    <p className="text-xs sm:text-sm text-red-600 leading-relaxed">
                      You can request a new verification email from your profile
                      if needed.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  to="/profile"
                  className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-medium text-sm sm:text-base transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg flex-1 sm:flex-none"
                >
                  <FaHome className="group-hover:animate-bounce" />
                  <span>Back to Profile</span>
                </Link>

                <button
                  onClick={() => window.location.reload()}
                  className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-medium text-sm sm:text-base transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg flex-1 sm:flex-none"
                >
                  <FaRedo className="group-hover:animate-spin" />
                  <span>Try Again</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
