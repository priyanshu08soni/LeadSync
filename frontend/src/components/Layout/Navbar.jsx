import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import api from "../../api/api";
import { AuthContext } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";

function Navbar() {
  const { setUser } = useContext(AuthContext);
  const { showNotification } = useNotification(); 
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); // clear HTTP-only cookie on server
      setUser(null); // clear user from context
      showNotification("Logged out successfully!", "success"); 
      navigate("/login"); // redirect to login
    } catch (err) {
      console.error("Logout failed:", err);
      showNotification("Logout failed. Please try again.", "error"); 
    }
  };

  return (
    <nav className="sticky top-5 mx-4 md:mx-10 backdrop-blur-sm text-white px-6 py-3 flex justify-between items-center shadow-md rounded-full bg-white/70 z-50">
      {/* Logo + Title */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo" className="h-10" />
      </div>

      {/* Links */}
      <ul className="flex gap-6 text-sm font-medium text-gray-800">
        <li className="hover:text-blue-400 cursor-pointer">
          <a href="/">Home</a>
        </li>
        <li className="hover:text-blue-400 cursor-pointer">
          <a href="/leads">Leads</a>
        </li>
        <li className="hover:text-blue-400 cursor-pointer">
          <a href="/about">About</a>
        </li>
        <li className="hover:text-blue-400 cursor-pointer">
          <a href="/contact">Contact</a>
        </li>
      </ul>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="ml-6 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition"
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
