import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Recheck authentication status every time the component is rendered
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Login"); // Redirect to login if not authenticated
    } else {
      setIsAuthenticated(true); // Otherwise, set authenticated state
    }
  }, [navigate]);

  if (!isAuthenticated) {
    // Optionally, you can render a loading indicator while checking authentication
    return <div>Loading...</div>;
  }

  return <>{children}</>; // Render the protected content if authenticated
};

export default ProtectedRoute;
