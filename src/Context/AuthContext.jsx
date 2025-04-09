import { createContext, useContext, useState } from "react";
import { useToast } from "./ToastContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const showToast = useToast();

  // Load user from localStorage safely
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("current_user") || "null")
  );

  // Login method
  const login = (email, password) => {
    const stored = JSON.parse(localStorage.getItem("current_user") || "null");
    if (
      stored &&
      stored.email.trim() === email.trim() &&
      stored.password === password
    ) {
      setUser(stored);
      showToast("Logged in successfully", "success");
      return { success: true };
    }
    return { success: false, message: "Invalid email or password" };
  };

  // Signup method
  const signup = (newUser) => {
    const userWithId = {
      ...newUser,
      id: Date.now(), // You can also use crypto.randomUUID()
    };
    localStorage.setItem("current_user", JSON.stringify(userWithId));
    setUser(userWithId);
    showToast("Account created successfully", "success");
    return { success: true };
  };

  // Logout method
  const logout = () => {
    setUser(null);
    localStorage.removeItem("current_user");
    showToast("Logged out successfully", "success");
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);