import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import DriversDailyLog from "./Components/DriversDailyLog/DriversDailyLog";
import TripDetailsForm from "./Components/TripDetails/TripDetailsForm";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/DriversDailyLog" element={<DriversDailyLog />} />
          <Route path="/log-form" element={<TripDetailsForm />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
