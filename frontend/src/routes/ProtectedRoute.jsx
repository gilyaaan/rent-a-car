import { Navigate } from "react-router-dom";
import { isAuthenticated, getCurrentUser } from "../services/auth";

export default function ProtectedRoute({ children }) {
  // Check if JWT exists
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Get logged-in user
  const user = getCurrentUser();

  // Token exists but user information is missing
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Account is inactive
  if (user.is_active === false) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  return children;
}