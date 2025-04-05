import { Link } from "react-router-dom";
import { useState } from "react";
import { Avatar, AvatarFallback } from "../Components/ui";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../Components/ui";
import Logout from "../Pages/Logout";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md fixed top-0 w-full z-50 overflow-hidden">
      <div className="text-xl font-semibold tracking-wide">Driver's Log</div>

      {/* Desktop Links */}
      <div className="hidden md:flex gap-6 items-center">
        <Link
          to="/DriversDailyLog"
          className="text-lg hover:text-blue-400 transition duration-200 ease-in-out"
        >
          Home
        </Link>
        <Link
          to="/TripDetailsForm"
          className="text-lg hover:text-blue-400 transition duration-200 ease-in-out"
        >
          TripMap
        </Link>
        <Link
          to="/SignUp"
          className="text-lg hover:text-blue-400 transition duration-200 ease-in-out"
        >
          SignUp
        </Link>
        <Link
          to="/TruckRegistrationForm"
          className="text-lg hover:text-blue-400 transition duration-200 ease-in-out"
        >
          TrucksForm
        </Link>
        <Link
          to="/Login"
          className="text-lg hover:text-blue-400 transition duration-200 ease-in-out"
        >
          Login
        </Link>
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl">
          {isOpen ? "X" : "☰"}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-gray-800 text-white p-4">
          <ul className="space-y-4">
            <li>
              <Link
                to="/DriversDailyLog"
                className="block text-lg hover:text-blue-400"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/TripDetailsForm"
                className="block text-lg hover:text-blue-400"
              >
                TripMap
              </Link>
            </li>
            <li>
              <Link to="/SignUp" className="block text-lg hover:text-blue-400">
                SignUp
              </Link>
            </li>
            <li>
              <Link
                to="/TruckRegistrationForm"
                className="block text-lg hover:text-blue-400"
              >
                TrucksForm
              </Link>
            </li>
            <li>
              <Link to="/Login" className="block text-lg hover:text-blue-400">
                Login
              </Link>
            </li>
          </ul>
        </div>
      )}
      <div>
        {/* Right side profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer h-8 w-8">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>
              <Logout />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
