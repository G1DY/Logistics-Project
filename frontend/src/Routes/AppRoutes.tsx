import { Route, Routes } from "react-router-dom";
import TruckRegistrationForm from "../Pages/TruckRegistrationForm";
import SignUp from "../Pages/SignUp";
import Login from "../Pages/Login";
import TripDetailsForm from "../Pages/TripDetailsForm";
import DriversDailyLog from "../Pages/DriversDailyLog";

const AppRoutes = () => (
  <Routes>
    <Route path="/DriversDailyLog" element={<DriversDailyLog />} />
    <Route path="/TruckRegistrationForm" element={<TruckRegistrationForm />} />
    <Route path="/TripDetailsForm" element={<TripDetailsForm />} />
    <Route path="/Signup" element={<SignUp />} />
    <Route path="/Login" element={<Login />} />
    <Route path="*" element={<h1>404 Not Found</h1>} />
  </Routes>
);

export default AppRoutes;
