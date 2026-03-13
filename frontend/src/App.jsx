import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";

import PublicPage from "./pages/Public_page.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MyReports from "./pages/MyReports.jsx";
import SignIn from "./pages/SignIn.jsx";
import Register from "./pages/Register.jsx";

import AdminOverview from "./pages/Overview.jsx";
import AdminUserManagement from "./pages/UserManagement.jsx";
import ReceptForm from "./pages/ReceptForm.jsx";
import ReportManagement from "./pages/Report_Management.jsx";
import IncidentManagement from "./pages/incident_management.jsx";
import ThongKe from "./pages/ThongKe.jsx";

import RegisterConfirm from "./components/RegisterConfirm.jsx";
import LayoutAdmin from "./components/LayoutAdmin.jsx";
import ProtectedRoute from "./router/ProtectedRoute.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<PublicPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/confirm" element={<RegisterConfirm />} />

          {/* Citizen */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/myreport"
            element={
              <ProtectedRoute>
                <MyReports />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <LayoutAdmin />
              </ProtectedRoute>
            }
          >
            <Route path="overview" element={<AdminOverview />} />
            <Route path="recept-form" element={<ReceptForm />} />
            <Route path="reports" element={<ReportManagement />} />
            <Route path="incident-types" element={<IncidentManagement />} />
            <Route path="statistics" element={<ThongKe />} />
            <Route path="users" element={<AdminUserManagement />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
