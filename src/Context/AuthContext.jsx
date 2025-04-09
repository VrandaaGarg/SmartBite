import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("smartbite_user"))
  );

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("smartbite_users")) || [];
    const existing = users.find(
      (u) => u.email === email && u.password === password
    );
    if (existing) {
      setUser(existing);
      localStorage.setItem("smartbite_user", JSON.stringify(existing));
      return { success: true };
    }
    return { success: false, message: "Invalid email or password" };
  };

  const signup = (newUser) => {
    const users = JSON.parse(localStorage.getItem("smartbite_users")) || [];

    const exists = users.find((u) => u.email === newUser.email);
    if (exists) {
      return { success: false, message: "User with this email already exists" };
    }

    // 🔢 Get last used ID or start from 1
    let lastId = parseInt(localStorage.getItem("smartbite_user_id_counter")) || 0;
    const nextId = lastId + 1;

    // 🆔 Assign user ID
    const userWithId = {
      ...newUser,
      id: nextId,
    };

    // Update storage
    users.push(userWithId);
    localStorage.setItem("smartbite_users", JSON.stringify(users));
    localStorage.setItem("smartbite_user", JSON.stringify(userWithId));
    localStorage.setItem("smartbite_user_id_counter", nextId.toString());

    setUser(userWithId);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("smartbite_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);