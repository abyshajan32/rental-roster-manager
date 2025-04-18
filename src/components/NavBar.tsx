
import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Package2, Users, BarChart, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NavBar: FC = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  
  const navItems = [
    {
      label: "Dashboard",
      icon: <Home className="h-6 w-6" />,
      href: "/",
    },
    {
      label: "Inventory",
      icon: <Package2 className="h-6 w-6" />,
      href: "/inventory",
    },
    {
      label: "Customers",
      icon: <Users className="h-6 w-6" />,
      href: "/customers",
    },
    {
      label: "Rentals",
      icon: <BarChart className="h-6 w-6" />,
      href: "/rentals",
    },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center px-2 py-2 shadow-md">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.label}
            to={item.href}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              isActive ? "text-blue-500" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {item.icon}
            <span className={`text-xs mt-1 ${isActive ? "font-medium" : ""}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
      <button
        onClick={logout}
        className="flex flex-col items-center p-2 rounded-lg transition-colors text-gray-500 hover:text-red-500"
        aria-label="Logout"
      >
        <LogOut className="h-6 w-6" />
        <span className="text-xs mt-1">Logout</span>
      </button>
    </div>
  );
};

export default NavBar;
