import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [degree, setDegree] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [error, setError] = useState(null); // Set initial error state to null
  const [message, setMessage] = useState("");
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
        const { name, email, degree, years_of_experience } = response.data;
        setName(name);
        setEmail(email);
        setDegree(degree);
        setYearsOfExperience(years_of_experience);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        navigate("/login");
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in again.");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5005/update-profile",
        {
          name,
          email,
          password,
          degree,
          years_of_experience: yearsOfExperience,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Profile updated successfully!");
      setError(null); // Clear errors on success
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMessage =
        err.response?.data?.message || "Profile update failed";
      if (typeof errorMessage === "object") {
        setError(Object.values(errorMessage).join(", "));
      } else {
        setError(errorMessage);
      }
    }
  };

  return (
    <div>
      <h2>Update Profile</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password (leave blank to keep the same):</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Degree:</label>
          <input
            type="text"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
          />
        </div>
        <div>
          <label>Years of Experience:</label>
          <input
            type="number"
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(e.target.value)}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default UpdateProfile;
