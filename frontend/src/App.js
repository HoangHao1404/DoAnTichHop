import React from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard"
import MyReport from "./pages/MyReports"
// import Report from "./components/Report"
function App() {
  return (
    <div>
        <Dashboard/>  
      {/* <Report/> */}
      <MyReport/>
    </div>
  );
}

export default App;
