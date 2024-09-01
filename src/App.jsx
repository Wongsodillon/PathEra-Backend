import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import UpdateProfile from "./Pages/UpdateProfile";
import SavedJobs from "./Pages/SavedJobs";
import RecommendJobs from "./components/RecommendJobs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/recommend-jobs" element={<RecommendJobs />} />
      </Routes>
    </Router>
  );
}

export default App;
