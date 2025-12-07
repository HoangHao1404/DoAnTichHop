import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";

import Overview from "./pages/Overview";

function App() {
  return (
    <Router>
      <Overview />
    </Router>
  );
}

export default App;

