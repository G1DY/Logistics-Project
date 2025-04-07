import { Route, Routes } from "react-router-dom";
import TruckRegistrationForm from "../Pages/TruckRegistrationForm";
import SignUp from "../Pages/SignUp";
import Login from "../Pages/Login";
import TripDetailsForm from "../Pages/TripDetailsForm";
import DriversDailyLog from "../Pages/DriversDailyLog";
import Dashboard from "../Pages/Dashboard";
import DriversList from "../Pages/DriversList";
import ProtectedRoute from "../Components/ProtectedRoute";
import ErrorBoundary from "../Components/ErrorBoundary"; // import your ErrorBoundary component
import Layout from "../Components/Layout";

const AppRoutes = () => (
  <ErrorBoundary>
    <Routes>
      {/* Wrap all routes inside Layout */}
      <Route element={<Layout />}>
        {/* Public Routes */}
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />
        <Route
          path="/TruckRegistrationForm"
          element={<TruckRegistrationForm />}
        />

        {/* Protected Routes wrapped in ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/drivers" element={<DriversList />} />
          <Route
            path="/TruckRegistrationForm"
            element={<TruckRegistrationForm />}
          />
          <Route path="/TripDetailsForm" element={<TripDetailsForm />} />
          <Route path="/DriversDailyLog" element={<DriversDailyLog />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Route>
    </Routes>
  </ErrorBoundary>
);

export default AppRoutes;
