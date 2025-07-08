import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { useToast } from "./ToastContext";
import {
  getUserByEmail,
  createUser,
  updateUser,
  STORAGE_KEYS,
  getFromStorage,
  setToStorage,
  initializeApp,
} from "../utils/localStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { showToast } = useToast();
  const [user, setUser] = useState(() => {
    // Initialize app data on first load
    initializeApp();
    return getFromStorage(STORAGE_KEYS.CURRENT_USER);
  });

  const toastTimeoutRef = useRef(null);
  const pendingToastRef = useRef(null);

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

  // 🔐 Signup with local storage
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
      // Check if user already exists
      const existingUser = getUserByEmail(email);
      if (existingUser) {
        showSingleToast("Email already registered", "error");
        return { success: false, message: "Email already registered" };
      }

      // Create new user
      const newUser = createUser({
        Name: name,
        Email: email,
        Phone: phone,
        Password: password, // In real app, this would be hashed
        HouseNo: houseNo,
        Street: street,
        Landmark: landmark,
        City: city,
        State: state,
        Pincode: pincode,
      });

      showSingleToast("Account created successfully", "success");

      // Auto-login the new user
      return await login(email, password);
    } catch (err) {
      showSingleToast("Signup failed", "error");
      return { success: false, message: err.message };
    }
  };

  // 🔐 Login with local storage
  const login = async (email, password) => {
    try {
      // Find user by email
      const user = getUserByEmail(email);

      if (!user) {
        showSingleToast("Invalid email or password", "error");
        return { success: false, message: "Invalid email or password" };
      }

      // Simple password check (in real app, use proper hashing)
      if (user.Password !== password) {
        showSingleToast("Invalid email or password", "error");
        return { success: false, message: "Invalid email or password" };
      }

      // Create user session
      const fullUser = {
        ...user,
        isAdmin: user.IsAdmin === 1,
        token: `local_token_${user.CustomerID}_${Date.now()}`, // Mock token
      };

      setUser(fullUser);
      setToStorage(STORAGE_KEYS.CURRENT_USER, fullUser);

      showSingleToast("Logged in successfully", "success");
      return { success: true };
    } catch (err) {
      showSingleToast("Login failed", "error");
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToStorage(STORAGE_KEYS.CURRENT_USER, null);
    showSingleToast("Logged out successfully", "success");
    return { success: true };
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      if (!user) {
        showSingleToast("Please login first", "error");
        return { success: false, message: "Not authenticated" };
      }

      const updatedUser = updateUser(user.CustomerID, updates);
      if (updatedUser) {
        const fullUser = { ...user, ...updatedUser };
        setUser(fullUser);
        setToStorage(STORAGE_KEYS.CURRENT_USER, fullUser);
        showSingleToast("Profile updated successfully", "success");
        return { success: true };
      } else {
        showSingleToast("Failed to update profile", "error");
        return { success: false, message: "Update failed" };
      }
    } catch (err) {
      showSingleToast("Profile update failed", "error");
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
