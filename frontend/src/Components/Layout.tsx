import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Driver's Daily Log</h1>
      </header>

      {/* Navbar */}
      <nav className="bg-gray-800 text-white p-2 flex justify-center gap-4">
        <Link to="/DriversDailyLog" className="hover:underline">
          Home
        </Link>
        <Link to="/log-form" className="hover:underline">
          Log Form
        </Link>
      </nav>

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
