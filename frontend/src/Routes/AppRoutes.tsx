import { Route, Routes } from "react-router-dom";
import TruckRegistrationForm from "../Pages/TruckRegistrationForm";
import SignUp from "../Pages/SignUp";
import Login from "../Pages/Login";
import TripDetailsForm from "../Pages/TripDetailsForm";
import DriversDailyLog from "../Pages/DriversDailyLog";
import Dashboard from "../Pages/Dashboard";
import DriversList from "../Pages/DriversList";
import ProtectedRoute from "../Components/ProtectedRoute";

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/Signup" element={<SignUp />} />
    <Route path="/Login" element={<Login />} />

    {/* Protected routes */}
    <Route
      path="/DriversDailyLog"
      element={
        <ProtectedRoute>
          <DriversDailyLog />
        </ProtectedRoute>
      }
    />
    <Route
      path="/TruckRegistrationForm"
      element={
        <ProtectedRoute>
          <TruckRegistrationForm />
        </ProtectedRoute>
      }
    />
    <Route
      path="/TripDetailsForm"
      element={
        <ProtectedRoute>
          <TripDetailsForm />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/drivers"
      element={
        <ProtectedRoute>
          <DriversList />
        </ProtectedRoute>
      }
    />

    {/* Fallback */}
    <Route path="*" element={<h1>404 Not Found</h1>} />
  </Routes>
);

export default AppRoutes;
