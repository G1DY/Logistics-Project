import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import DriversDailyLog from "./Pages/DriversDailyLog";
import TripDetailsForm from "./Pages/TripDetailsForm";
import TruckRegistrationForm from "./Pages/TruckRegistrationForm";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/DriversDailyLog" element={<DriversDailyLog />} />
          <Route path="/TripDetailsForm" element={<TripDetailsForm />} />
          <Route
            path="/TruckRegistrationForm"
            element={<TruckRegistrationForm />}
          />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
