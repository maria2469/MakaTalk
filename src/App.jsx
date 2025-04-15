import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/LandingPage/Landing";
import Learn from "./components/Learn/Learn";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/learn" element={<Learn />} />
      </Routes>
    </Router>
  );
};

export default App;
