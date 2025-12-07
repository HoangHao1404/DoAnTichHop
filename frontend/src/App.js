import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Dashboard from "./pages/Dashboard";
import MyReports from "./pages/MyReports";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import RegisterConfirm from "./components/RegisterConfirm";
import Navbar from "./components/NavBar";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    // <AuthProvider>
    //   <Router>
    //     <Navbar/>
    //   </Router>
    // </AuthProvider>
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/confirm" element={<RegisterConfirm />} />

          {/* App chính */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/myreport" element={<MyReports />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
