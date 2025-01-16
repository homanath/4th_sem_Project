import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";

export default function PrivateRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated } = useSelector(selectAuth);
  const token = localStorage.getItem("token");

  if (!token || !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If no specific roles are required, or user's role is in the allowed roles
  if (allowedRoles.length === 0 || allowedRoles.includes(user?.role)) {
    return children;
  }

  // If user's role is not allowed, redirect to dashboard
  return <Navigate to="/dashboard" />;
}
