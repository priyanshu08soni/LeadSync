import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import { Mail, Lock, User, UserCircle, Users, Loader2 } from "lucide-react";

import logo from "../assets/logo.png";
import CustomDropdown from "../components/common/CustomDropdown";

export default function Register() {
  // ... (keep state and hooks)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "sales_rep",
    team: "",
  });
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  // ... (keep useEffect and handlers)
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await api.get("/teams");
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

  const handleRoleChange = (value) => {
    setForm({ ...form, role: value });
  };

  const handleTeamChange = (value) => {
    setForm({ ...form, team: value });
  };

  const roleOptions = [
    { label: "Manager", value: "manager" },
    { label: "Sales Rep", value: "sales_rep" },
  ];

  const teamOptions = teams.map((team) => ({
    label: team.name, // Access team name directly
    value: team._id,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post("/auth/register", form);
      setUser(res.data.user);
      showNotification("Registration successful!", "success");
      navigate("/leads");
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err.response?.data?.message || "Registration failed");
      showNotification("Registration failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 glass-card rounded-2xl p-8 animate-in fade-in zoom-in duration-500 dark:bg-slate-900/80 bg-white/95 border dark:border-white/10 border-slate-200 shadow-2xl">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="LeadSync Logo" className="h-16 w-auto rounded-full" />
          </div>
          <h2 className="text-4xl font-extrabold tracking-widest dark:text-slate-50 text-slate-900 mb-2">Create Account</h2>
          <p className="dark:text-slate-500 text-slate-400 text-sm font-bold  tracking-widest">Join the Enterprise Lead Network</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium dark:text-slate-300 text-slate-600 mb-2">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-slate-500 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full pl-10 glass-input"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium dark:text-slate-300 text-slate-600 mb-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-slate-500 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 glass-input"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium dark:text-slate-300 text-slate-600 mb-2">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-slate-500 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 glass-input"
                />
              </div>
            </div>

            {/* Role Dropdown */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium dark:text-slate-300 text-slate-600 mb-2">Role</label>
                <div className="relative group">
                  <CustomDropdown
                    value={form.role}
                    onChange={handleRoleChange}
                    options={roleOptions}
                    placeholder="Select Role"
                    className=""
                  />
                </div>
              </div>

              {/* Team Field */}
              {form.role === "manager" ? (
                <div>
                  <label className="block text-sm font-medium dark:text-slate-300 text-slate-600 mb-2">Team Name</label>
                  <div className="relative group">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-slate-500 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      name="team"
                      type="text"
                      value={form.team}
                      onChange={handleChange}
                      placeholder="My Awesome Team"
                      required
                      className="w-full pl-10 glass-input"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium dark:text-slate-300 text-slate-600 mb-2">Select Team</label>
                  <div className="relative group">
                    <CustomDropdown
                      value={form.team}
                      onChange={handleTeamChange}
                      options={teamOptions}
                      placeholder="Select Team"
                      className=""
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full glass-button flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm dark:text-slate-400 text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

