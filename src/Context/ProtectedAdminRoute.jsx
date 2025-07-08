// src/Context/ProtectedAdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedAdminRoute = ({ children }) => {
  const { user } = useAuth();

  const isAdmin = user?.isAdmin === true;
  if (!user || !isAdmin) {
    console.log("Admin Route Check", { user, isAdmin });
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedAdminRoute;
