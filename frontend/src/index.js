import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContext } from "./contexts/AuthContext";
import api from "./api/api"; // Axios instance with withCredentials: true

function Root() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>; // or spinner

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <App />
    </AuthContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
