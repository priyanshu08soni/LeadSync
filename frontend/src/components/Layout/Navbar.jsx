import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import api from "../../api/api";
import { AuthContext } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import { Menu, X, Home, BarChart3, Users as UsersIcon, Briefcase } from "lucide-react";

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      showNotification("Logged out successfully!", "success");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      showNotification("Logout failed. Please try again.", "error");
    }
  };

  const navLinks = [
    { path: "/", label: "Home", icon: <Home size={18} /> },
    { path: "/dashboard", label: "Dashboard", icon: <BarChart3 size={18} /> },
    { path: "/leads", label: "Leads", icon: <Briefcase size={18} /> },
    { 
      path: "/users", 
      label: "Users", 
      icon: <UsersIcon size={18} />,
      adminOnly: true 
    },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-5 mx-4 md:mx-10 backdrop-blur-sm text-white px-6 py-3 flex justify-between items-center shadow-md rounded-full bg-white/70 z-50">
      {/* Logo + Title */}
      <div className="flex items-center gap-3">
        <img 
          src={logo} 
          alt="Logo" 
          className="h-10 cursor-pointer" 
          onClick={() => navigate("/")}
        />
        <span className="hidden md:block text-gray-800 font-semibold">
          LeadSync CRM
        </span>
      </div>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-6 text-sm font-medium text-gray-800">
        {navLinks.map((link) => {
          // Skip admin-only links for non-admin users
          if (link.adminOnly && user?.role !== "admin") {
            return null;
          }

          return (
            <li key={link.path}>
              <button
                onClick={() => navigate(link.path)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full transition ${
                  isActive(link.path)
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-200 hover:text-blue-600"
                }`}
              >
                {link.icon}
                {link.label}
              </button>
            </li>
          );
        })}
      </ul>

      {/* User Info & Logout */}
      <div className="hidden md:flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <span className="hidden lg:block">{user.name}</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden text-gray-800"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 mx-4 bg-white rounded-lg shadow-lg p-4 md:hidden">
          <ul className="space-y-2">
            {navLinks.map((link) => {
              if (link.adminOnly && user?.role !== "admin") {
                return null;
              }

              return (
                <li key={link.path}>
                  <button
                    onClick={() => {
                      navigate(link.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive(link.path)
                        ? "bg-blue-600 text-white"
                        : "text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </button>
                </li>
              );
            })}
          </ul>

          {user && (
            <div className="mt-4 pt-4 border-t flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
            className="w-full mt-4 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;