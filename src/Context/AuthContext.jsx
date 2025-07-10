import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useToast } from "./ToastContext";
import appwriteAuth from "../config/appwriteauth";
import appwriteService from "../config/service";

const AuthContext = createContext();

// Local storage keys for current user only
const STORAGE_KEYS = {
  CURRENT_USER: "current_user",
};

const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return null;
  }
};

const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting ${key} to localStorage:`, error);
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const { showToast } = useToast();
  const [user, setUser] = useState(() => {
    return getFromStorage(STORAGE_KEYS.CURRENT_USER);
  });
  const [loading, setLoading] = useState(true);

  const toastTimeoutRef = useRef(null);
  const pendingToastRef = useRef(null);

  // Check for current user on app load
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const currentUser = await appwriteAuth.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setToStorage(STORAGE_KEYS.CURRENT_USER, currentUser);
        }
      } catch (error) {
        console.error("Error checking current user:", error);
      } finally {
        setLoading(false);
      }
    };

    checkCurrentUser();
  }, []);

  const showSingleToast = useCallback(
    (message, type) => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = null;
      }

      pendingToastRef.current = { message, type };

      toastTimeoutRef.current = setTimeout(() => {
        if (pendingToastRef.current) {
          showToast(
            pendingToastRef.current.message,
            pendingToastRef.current.type
          );
          pendingToastRef.current = null;
        }
      }, 300);
    },
    [showToast]
  );

  // 🔐 Signup with Appwrite
  const signup = async ({
    name,
    email,
    phone,
    password,
    houseNo,
    street,
    landmark,
    city,
    state,
    pincode,
  }) => {
    try {
      // Create account in Appwrite (includes auth and user document)
      const result = await appwriteAuth.createAccount({
        name,
        email,
        phone,
        password,
        houseNo,
        street,
        landmark,
        city,
        state,
        pincode,
      });

      if (result.success) {
        // Get the current user after signup
        const currentUser = await appwriteAuth.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setToStorage(STORAGE_KEYS.CURRENT_USER, currentUser);
        }

        showSingleToast("Account created successfully", "success");
        return { success: true };
      }
    } catch (err) {
      console.error("Signup error:", err);
      showSingleToast(err.message || "Signup failed", "error");
      return { success: false, message: err.message };
    }
  };

  // 🔐 Login with Appwrite
  const login = async (email, password) => {
    try {
      // Login with Appwrite
      const result = await appwriteAuth.login({ email, password });

      if (result.success) {
        // Get the current user after login
        const currentUser = await appwriteAuth.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setToStorage(STORAGE_KEYS.CURRENT_USER, currentUser);
        }

        showSingleToast("Logged in successfully", "success");
        return { success: true };
      }
    } catch (err) {
      console.error("Login error:", err);
      showSingleToast(err.message || "Login failed", "error");
      return { success: false, message: err.message };
    }
  };

  const logout = async () => {
    try {
      await appwriteAuth.logout();
      setUser(null);
      setToStorage(STORAGE_KEYS.CURRENT_USER, null);
      showSingleToast("Logged out successfully", "success");
      return { success: true };
    } catch (err) {
      console.error("Logout error:", err);
      // Even if Appwrite logout fails, clear local state
      setUser(null);
      setToStorage(STORAGE_KEYS.CURRENT_USER, null);
      showSingleToast("Logged out successfully", "success");
      return { success: true };
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      if (!user) {
        showSingleToast("Please login first", "error");
        return { success: false, message: "Not authenticated" };
      }

      const result = await appwriteAuth.updateProfile(user.$id, updates);
      if (result.success) {
        const fullUser = { ...user, ...result.user };
        setUser(fullUser);
        setToStorage(STORAGE_KEYS.CURRENT_USER, fullUser);
        showSingleToast("Profile updated successfully", "success");
        return { success: true };
      } else {
        showSingleToast("Failed to update profile", "error");
        return { success: false, message: "Update failed" };
      }
    } catch (err) {
      console.error("Profile update error:", err);
      showSingleToast(err.message || "Profile update failed", "error");
      return { success: false, message: err.message };
    }
  };

  // Password reset functionality
  const resetPassword = async (email) => {
    try {
      const resetUrl = `${window.location.origin}/reset-password`;
      const result = await appwriteAuth.createPasswordRecovery(email, resetUrl);
      if (result.success) {
        showSingleToast("Password reset email sent successfully", "success");
        return { success: true };
      }
    } catch (err) {
      console.error("Password reset error:", err);
      showSingleToast(err.message || "Failed to send reset email", "error");
      return { success: false, message: err.message };
    }
  };

  const confirmPasswordReset = async (userId, secret, newPassword) => {
    try {
      const result = await appwriteAuth.updatePasswordRecovery(
        userId,
        secret,
        newPassword
      );
      if (result.success) {
        showSingleToast("Password updated successfully", "success");
        return { success: true };
      }
    } catch (err) {
      console.error("Password confirmation error:", err);
      showSingleToast(err.message || "Failed to update password", "error");
      return { success: false, message: err.message };
    }
  };

  // Email verification functionality
  const sendEmailVerification = async () => {
    try {
      if (!user) {
        showSingleToast("Please login first", "error");
        return { success: false, message: "Not authenticated" };
      }

      const verificationUrl = `${window.location.origin}/verify-email`;
      const result = await appwriteService.verifyEmail(verificationUrl);

      if (result.success) {
        showSingleToast(
          "Verification email sent! Check your inbox.",
          "success"
        );
        return { success: true };
      }
    } catch (err) {
      console.error("Email verification error:", err);
      showSingleToast(
        err.message || "Failed to send verification email",
        "error"
      );
      return { success: false, message: err.message };
    }
  };

  const confirmEmailVerification = async (userId, secret) => {
    try {
      const result = await appwriteService.confirmEmailVerification(
        userId,
        secret
      );

      if (result.success) {
        // Refresh user data to get updated verification status
        const currentUser = await appwriteAuth.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setToStorage(STORAGE_KEYS.CURRENT_USER, currentUser);
        }

        showSingleToast("Email verified successfully!", "success");
        return { success: true };
      }
    } catch (err) {
      console.error("Email verification confirmation error:", err);

      // Better error handling for common scenarios
      let errorMessage = err.message || "Failed to verify email";

      if (err.message && err.message.includes("Invalid token")) {
        errorMessage =
          "This verification link has expired or has already been used.";
        // Don't show toast for invalid token as it's handled in the UI
        return { success: false, message: errorMessage };
      }

      showSingleToast(errorMessage, "error");
      return { success: false, message: errorMessage };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        resetPassword,
        confirmPasswordReset,
        sendEmailVerification,
        confirmEmailVerification,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
