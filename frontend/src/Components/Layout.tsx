import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar/Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Navbar */}
      <header className="fixed top-0 w-full bg-gray-900 text-white p-4 flex flex-col items-center border-b border-gray-700 shadow-md">
        {/* Top Section */}
        <div className="flex justify-between w-full max-w-6xl px-4">
          <h1 className="text-2xl font-bold">Driver's Daily Log</h1>
          <div className="text-sm">
            <p>
              Company: <span className="font-semibold">XYZ Logistics</span>
            </p>
            <p>
              Driver: <span className="font-semibold">John Doe</span>
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <Navbar />
      </header>

      {/* Push Content Down */}
      <div className="mt-24">
        {/* Ensures main content is not hidden under navbar */}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; {new Date().getFullYear()} Driver's Log System</p>
      </footer>
    </div>
  );
};
export default Layout;
