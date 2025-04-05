// src/Components/Logout.tsx
import { useAuth } from "../Context/AuthContext"; // Import the context
import { useNavigate } from "react-router-dom"; // Import the navigate hook for redirection

const Logout = () => {
  const { logout } = useAuth(); // Access logout from context
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = () => {
    logout(); // Call the logout function to clear the token and set authenticated state to false
    navigate("/Login"); // Redirect to login page
  };

  return (
    <button onClick={handleLogout} className="btn-logout">
      Logout
    </button>
  );
};

export default Logout;
