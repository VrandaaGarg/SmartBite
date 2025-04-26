import { createContext, useContext, useState, useCallback, useRef } from "react";
import { useToast } from "./ToastContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { showToast } = useToast();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("current_user") || "null")
  );

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

  // 🔐 Signup via backend
  const signup = async ({
    name, email, phone, password,
    houseNo, street, landmark, city, state, pincode
  }) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Name: name,
          Email: email,
          Phone: phone,
          Password: password,
          HouseNo: houseNo,
          Street: street,
          Landmark: landmark,
          City: city,
          State: state,
          Pincode: pincode
        }),
      });

      const data = await res.json();

      if (res.status === 201) {
        showSingleToast("Account created successfully", "success");

        // ✅ Auto-login using same credentials
        return await login(email, password);
      } else {
        showSingleToast(data.error || "Signup failed", "error");
        return { success: false, message: data.error };
      }
    } catch (err) {
      showSingleToast("Signup failed", "error");
      return { success: false, message: err.message };
    }
  };

  // 🔐 Login via backend
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Password: password }),
      });

      const data = await res.json();
      if (res.ok) {
        const isAdmin = data.user.Email === "admin@smartbite.com"; // 👈 set admin condition

        const fullUser = {
          ...data.user,
          token: data.token,
          isAdmin: data.user.IsAdmin === 1, // normalize here
        };
        
        // check that data.user has `isAdmin` from the backend
        setUser(fullUser);
        localStorage.setItem("current_user", JSON.stringify(fullUser));
        
        localStorage.setItem("current_user", JSON.stringify(fullUser));

        showSingleToast("Logged in successfully", "success");
        return { success: true };
      } else {
        showSingleToast(data.error || "Login failed", "error");
        return { success: false, message: data.error };
      }
    } catch (err) {
      showSingleToast("Login failed", "error");
      return { success: false, message: err.message };
    }
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
