import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth(); // Get authentication status from context

  if (!isAuthenticated) {
    // If the user is not authenticated, redirect to login page
    return <Navigate to="/login" />;
  }

  return <Outlet />; // If authenticated, render the child route
};

export default ProtectedRoute;
