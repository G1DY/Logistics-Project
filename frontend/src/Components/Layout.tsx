import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom"; // Import Outlet for rendering nested routes

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white mt-4 fixed min-h-screen top-0 left-0 z-20">
        <Sidebar /> {/* Render Sidebar */}
      </aside>

      <div className="flex-1 flex flex-col ml-64">
        {/* Offset content by sidebar width */}
        <header className="fixed top-0 left-0 w-full bg-gray-900 text-white p-4 flex flex-col items-center border-b border-gray-700 shadow-md z-30">
          {/* Top Section */}
          <div className="flex justify-between w-auto max-w-6xl px-4">
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

        {/* Main Content */}
        <main className="flex-1 p-4 mt-24">
          <Outlet />{" "}
          {/* Render the nested route components (protected routes) here */}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white p-4 w-full mt-auto text-center h-20 flex items-center justify-center ">
          <p>&copy; {new Date().getFullYear()} Driver's Log System</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
