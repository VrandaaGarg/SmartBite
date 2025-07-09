import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useToast } from "../Context/ToastContext";
import appwriteAuth from "../config/appwriteauth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [animate, setAnimate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create the reset URL - this should point to your reset password page
      const resetUrl = `${window.location.origin}/reset-password`;

      // Send password recovery email using Appwrite
      await appwriteAuth.createPasswordRecovery(email, resetUrl);

      showToast(
        "Password reset link has been sent to your email address. Please check your inbox.",
        "success"
      );
      setEmail("");
    } catch (error) {
      console.error("Password recovery error:", error);
      showToast(
        error.message ||
          "Failed to send password reset email. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: animate ? 1 : 0, y: animate ? 0 : 30 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">
            Forgot Password
          </h1>
          <p className="text-gray-600">We'll send a reset link to your email</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r bg-red-500 hover:bg-red-600 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <FaPaperPlane /> {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Remember your password?{" "}
          <Link to="/login" className="text-red-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
