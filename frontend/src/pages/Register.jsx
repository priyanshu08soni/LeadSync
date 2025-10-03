import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // axios instance
import { AuthContext } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "sales_rep", // default role
    team: "",
  });
  const [teams, setTeams] = useState([]); // for listing existing teams
  const [error, setError] = useState(null);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  // Fetch teams when registering a Sales Rep
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await api.get("/teams"); // backend route: get all teams
        setTeams(res.data);
      } catch (err) {
        console.error("Failed to fetch teams", err);
      }
    };
    if (form.role === "sales_rep") fetchTeams();
  }, [form.role]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      await api.post("/auth/register", form); // send { name, email, password, role, team }
  
      const res = await api.get("/auth/me");
      setUser(res.data.user);
      showNotification("Registration successful!", "success");
      navigate("/leads");
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err.response?.data?.message || "Registration failed");
      showNotification("Registration failed.", "error");
    }
  };
  
  
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role Dropdown (No Admin option) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="manager">Manager</option>
              <option value="sales_rep">Sales Rep</option>
            </select>
          </div>

          {/* Team Field (Conditional Rendering) */}
          {form.role === "manager" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Create Team
              </label>
              <input
                name="team"
                type="text"
                value={form.team}
                onChange={handleChange}
                placeholder="Enter team name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {form.role === "sales_rep" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Team
              </label>
              <select
                name="team"
                value={form.team}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select a Team --</option>
                {teams && teams?.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team?.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
