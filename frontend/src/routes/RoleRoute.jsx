import { Navigate } from "react-router-dom";
import { getCurrentUser, isAuthenticated } from "../services/auth";

export default function RoleRoute({
  children,
  allowedRoles
}) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "user") {
      return <Navigate to="/user-dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}