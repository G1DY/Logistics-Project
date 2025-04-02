import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import DriversDailyLog from "./Components/DriversDailyLog/DriversDailyLog";
import TripDetailsForm from "./Components/TripDetails/TripDetailsForm";
import TruckRegistrationForm from "./Components/Registration/TruckRegistrationForm";
import SignUp from "./Components/User/SignUp";

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
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
