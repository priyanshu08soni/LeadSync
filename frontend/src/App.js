import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";

import Home from "./pages/Home";
import Leads from "./pages/Leads";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/Route/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import { NotificationProvider } from "./contexts/NotificationContext"; // import provider

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes wrapped with Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Home />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard/>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads"
            element={
              <ProtectedRoute>
                <Layout>
                  <Leads />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
