import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("current_user"))
  );

  const login = (email, password) => {
    const stored = JSON.parse(localStorage.getItem("current_user"));
    if (stored && stored.email === email && stored.password === password) {
      setUser(stored);
      return { success: true };
    }
    return { success: false, message: "Invalid email or password" };
  };

  const signup = (newUser) => {
    const userWithId = {
      ...newUser,
      id: Date.now(), // or use crypto.randomUUID() if preferred
    };
    localStorage.setItem("current_user", JSON.stringify(userWithId));
    setUser(userWithId);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("current_user"); // ✅ required
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
