import React, { useState, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext";
import { Mail, Lock, Loader2 } from "lucide-react";

import logo from "../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      setUser(res.data.user);
      showNotification("Login successful!", "success");
      navigate("/");
    } catch (err) {
      showNotification(err.response?.data?.message || "Invalid Credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 glass-card rounded-2xl p-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="LeadSync Logo" className="h-16 w-auto rounded-full" />
          </div>
          <h2 className="text-4xl font-extrabold tracking-widest dark:text-slate-50 text-slate-900 mb-2 ">Welcome Back</h2>
          <p className="dark:text-slate-500 text-slate-600 text-sm font-bold tracking-widest">Enterprise Pipeline Suite</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium dark:text-slate-300 text-slate-700 mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-11 glass-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-slate-300 text-slate-700 mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 glass-input"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full glass-button flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="text-center space-y-6">
          <p className="dark:text-slate-400 text-slate-600 text-sm">
            New to LeadSync?{" "}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-bold transition-colors underline decoration-blue-500/30 underline-offset-4">
              Create an account
            </Link>
          </p>

          <div className="pt-8 border-t dark:border-white/5 border-slate-200">
            <p className="text-[10px] font-black dark:text-slate-600 text-slate-500 uppercase tracking-widest mb-4">Developer Test Access</p>
            <div className="dark:bg-slate-950/50 bg-slate-100/50 rounded-2xl p-4 text-xs text-left dark:border-white/5 border-slate-200 shadow-inner">
              <div className="flex justify-between items-center mb-2">
                <span className="dark:text-slate-500 text-slate-600 font-bold uppercase tracking-tighter">Login ID</span>
                <span className="dark:text-slate-200 text-slate-800 font-mono">priyanshus20k4@gmail.com</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="dark:text-slate-500 text-slate-600 font-bold uppercase tracking-tighter">Passcode</span>
                <span className="dark:text-slate-200 text-slate-800 font-mono underline decoration-blue-500/50">1234</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

