import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useToast } from "../Context/ToastContext";
import appwriteAuth from "../config/appwriteauth";
import { p } from "framer-motion/client";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const userId = params.get("userId");
  const secret = params.get("secret");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setAnimate(true);

    // Check if required parameters are present
    if (!userId || !secret) {
      showToast(
        "Invalid reset link. Please request a new password reset.",
        "error"
      );
      navigate("/forgot-password");
    }
  }, [userId, secret, navigate, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    if (password.length < 8) {
      showToast("Password must be at least 8 characters long", "error");
      return;
    }

    setIsLoading(true);

    try {
      // Use Appwrite to update password recovery
      await appwriteAuth.updatePasswordRecovery(userId, secret, password);

      showToast(
        "Password has been reset successfully! You can now login with your new password.",
        "success"
      );
      setPassword("");
      setConfirmPassword("");
      navigate("/login");
    } catch (error) {
      console.error("Password reset error:", error);
      showToast(
        error.message ||
          "Failed to reset password. Please try again or request a new reset link.",
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
            Reset Password
          </h1>
          <p className="text-gray-600">Set a new password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>
          {password.length == 0 ? (
            <p className="text-sm text-red-600">Password is required</p>
          ) : password.length < 8 ? (
            <p className="text-sm text-red-600">
              Password must be at least 8 characters long
            </p>
          ) : password.length > 8 && confirmPassword.length === 0 ? (
            <p className="text-sm text-red-600">Confirm your password</p>
          ) : password !== confirmPassword ? (
            <p className="text-sm text-red-600">Passwords do not match</p>
          ) : (
            <p className="text-sm text-green-600">Password match succesfully</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r bg-red-500 hover:bg-red-600 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Remember your password?{" "}
          <Link to="/login" className="text-red-600 hover:underline">
            Go back to Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
