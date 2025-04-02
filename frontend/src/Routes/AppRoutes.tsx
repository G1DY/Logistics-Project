import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../Pages/DriversDailyLog";
import TripDetails from "../Pages/TripDetailsForm";
import SignUp from "../Pages/SignUp";
import Login from "../Pages/Login";

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/trip-details" element={<TripDetails />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  </Router>
);

export default AppRoutes;
