import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import DriversDailyLog from "./Components/DriversDailyLog/DriversDailyLog";
import TripDetailsForm from "./Components/TripDetails/TripDetailsForm";
import RouteMapTest from "./Components/RouteMap/RouteMapTest";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/DriversDailyLog" element={<DriversDailyLog />} />
          <Route path="/log-form" element={<TripDetailsForm />} />
          <Route path="/test-map" element={<RouteMapTest />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
