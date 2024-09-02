import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import SavedJobs from "./Pages/SavedJobs";
import RecommendJobs from "./Pages/RecommendJobs";
import JobDetail from "./Pages/JobDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/recommend-jobs" element={<RecommendJobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
