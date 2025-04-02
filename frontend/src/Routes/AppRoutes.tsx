import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../Pages/DriversDailyLog";
import TruckRegistrationForm from "../Pages/TruckRegistrationForm";
import SignUp from "../Pages/SignUp";
import Login from "../Pages/Login";
import TripDetailsForm from "../Pages/TripDetailsForm";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/truck-registration" element={<TruckRegistrationForm />} />
    <Route path="/trip-details" element={<TripDetailsForm />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/login" element={<Login />} />
    <Route path="*" element={<h1>404 Not Found</h1>} />
  </Routes>
);

export default AppRoutes;
