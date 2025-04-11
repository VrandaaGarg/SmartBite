import { createContext, useContext, useState, useCallback, useRef } from "react";
import { useToast } from "./ToastContext"; // ✅

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { showToast } = useToast(); 
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("current_user") || "null")
  );

  // Debounced Toast Handler
  const toastTimeoutRef = useRef(null);
  const pendingToastRef = useRef(null);

  const showSingleToast = useCallback((message, type) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }

    pendingToastRef.current = { message, type };

    toastTimeoutRef.current = setTimeout(() => {
      if (pendingToastRef.current) {
        showToast(pendingToastRef.current.message, pendingToastRef.current.type);
        pendingToastRef.current = null;
      }
    }, 300);
  }, [showToast]);

  const login = (email, password) => {
    const stored = JSON.parse(localStorage.getItem("current_user") || "null");
    if (
      stored &&
      stored.email.trim() === email.trim() &&
      stored.password === password
    ) {
      setUser(stored);
      showSingleToast("Logged in successfully", "success");
      return { success: true };
    }
    return { success: false, message: "Invalid email or password" };
  };

  const signup = (newUser) => {
    const userWithId = {
      ...newUser,
      id: Date.now(),
    };
    localStorage.setItem("current_user", JSON.stringify(userWithId));
    setUser(userWithId);
    showSingleToast("Account created successfully", "success");
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("current_user");
    showSingleToast("Logged out successfully", "success");
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
