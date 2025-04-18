// src/Context/ProtectedAdminRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("current_user"));
  const token = user?.token;

  const isAdmin = user?.isAdmin === true; // ✅ use correct key
  if (!user || !token || !isAdmin) {
    console.log("Admin Route Check", { user, token, isAdmin });

    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedAdminRoute;
