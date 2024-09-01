import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import ShowJobs from "../components/ShowJobs";
import axios from "axios";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5005/auth", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        navigate("/login");
      });
  }, [navigate]);

  return (
    <div>
      {user ? (
        <>
          <h1>Welcome, {user.name}!</h1>
          <button onClick={() => navigate("/update-profile")}>
            Update Profile
          </button>
          <button onClick={() => navigate("/saved-jobs")}>
            View Saved Jobs
          </button>
          <button onClick={() => navigate("/recommend-jobs")}>
            Recommend Jobs
          </button>
          <LogoutButton onLogout={() => navigate("/login")} />
          <ShowJobs userId={user.id} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Dashboard;
