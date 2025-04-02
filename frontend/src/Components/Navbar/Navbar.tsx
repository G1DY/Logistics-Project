import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md fixed top-0 w-full z-50 overflow-hidden">
      <div className="text-lg font-bold">Driver's Log</div>
      <div className="flex gap-4">
        <Link to="/DriversDailyLog" className="hover:underline">
          Home
        </Link>
        <Link to="/TripDetailsForm" className="hover:underline">
          TripMap
        </Link>
        <Link to="/SignUp" className="hover:underline">
          SignUp
        </Link>
        <Link to="/TruckRegistrationForm" className="hover:underline">
          TrucksForm
        </Link>
        <Link to="/Login" className="hover:underline">
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
