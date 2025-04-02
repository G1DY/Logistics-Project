import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./Components/Layout";
import AppRoutes from "./Routes/AppRoutes";

const App = () => {
  return (
    <Router>
      <Layout>
        <AppRoutes /> {/* Routes are now inside BrowserRouter */}
      </Layout>
    </Router>
  );
};

export default App;
