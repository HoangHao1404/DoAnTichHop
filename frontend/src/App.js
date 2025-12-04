import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard"
import MyReport from "./pages/MyReports"
// import Register from "./pages/Register"
// import Report from "./components/Report"
// import SignIn from "./pages/SignIn"
// import Register from "./pages/Register"
function App() {
  return (
    <div>
      <MyReport/>
      {/* <MyReport /> */}
      {/* <Register/> */}
      <Dashboard/> 
    </div>
  );
}

export default App;
