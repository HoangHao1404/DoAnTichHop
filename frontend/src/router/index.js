import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import SignIn from "../pages/SignIn";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import MyReports from "../pages/MyReports";

// Components
import RegisterConfirm from "../components/RegisterConfirm";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<SignIn />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-confirm" element={<RegisterConfirm />} />

      {/* Main App Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/myreports" element={<MyReports />} />

      {/* Redirect unknown routes to signin */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
