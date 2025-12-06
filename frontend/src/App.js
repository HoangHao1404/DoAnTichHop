import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import MyReports from "./pages/MyReports";
import { AuthProvider } from "./context/AuthContext";
// import Report from "./components/Report"
// import SignIn from "./pages/SignIn"
// import Register from "./pages/Register"
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/myreport" element={<MyReports />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
