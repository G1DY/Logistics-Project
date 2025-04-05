import { NavLink } from "react-router-dom";
import { TruckIcon, UserIcon } from "lucide-react"; // Add any icons you need

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-gray-800 text-white p-4">
      {/* Logo or title */}
      <div className="text-2xl font-bold mb-6 text-center">Driver's Log</div>

      {/* Navigation Links */}
      <div className="space-y-4">
        <NavLink
          to="/dashboard"
          className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded"
        >
          <TruckIcon className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/drivers"
          className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded"
        >
          <UserIcon className="w-5 h-5" />
          <span>DriversList</span>
        </NavLink>

        {/* Add more sidebar links here */}
      </div>
    </div>
  );
};

export default Sidebar;
