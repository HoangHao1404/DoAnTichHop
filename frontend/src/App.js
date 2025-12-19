import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import PublicPage from "./pages/Public_page";

import Dashboard from "./pages/Dashboard";
import MyReports from "./pages/MyReports";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import RegisterConfirm from "./components/RegisterConfirm";

import AdminOverview from "./pages/Overview";
import AdminUserManagerment from "./pages/UserManagement";
import ReceptForm from "./pages/ReceptForm";
import ReportManagement from "./pages/Report_Management";
import IncidentManagement from "./pages/incident_management";
import ThongKe from "./pages/ThongKe";

import LayoutAdmin from "./components/LayoutAdmin";
import ProtectedRoute from "./router/ProtectedRoute"; 
import { AuthProvider } from "./context/AuthContext";

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
          
          {/*citizen*/}
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

          {/* admin */}
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
            <Route path="users" element={<AdminUserManagerment />} />
          </Route>

          {/* Manager 
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute requiredRole="manager">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          /> */}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
