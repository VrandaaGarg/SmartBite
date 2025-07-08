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

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, updateProfile, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
