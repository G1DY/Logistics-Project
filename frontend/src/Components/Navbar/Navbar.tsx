import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md fixed top-0 w-full z-10">
      <div className="text-lg font-bold">Driver's Log</div>
      <div className="flex gap-4">
        <Link to="/DriversDailyLog" className="hover:underline">
          Home
        </Link>
        <Link to="/TripDetailsForm" className="hover:underline">
          Log Form
        </Link>
        <Link to="/test-map" className="hover:underline">
          RoutesMap
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
