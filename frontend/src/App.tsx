import DriversDailyLog from "./Components/DriversDailyLog";
import RouteForm from "./Components/RouteForm";

const App = () => {
  return (
    <div className="bg-amber-500 text-3xl text-green-400 items-center justify-center flex min-h-screen">
      <RouteForm />
      <DriversDailyLog />
    </div>
  );
};
export default App;
