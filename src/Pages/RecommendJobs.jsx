import axios from "axios";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const RecommendJobs = () => {
  const [userData, setUserData] = useState({
    user_id: null, // Initially null to ensure we detect when it's properly set
    job_title: "",
    skills: "",
    degree: "Bachelors",
    years_of_experience: 2,
  });

  const [jobTitles, setJobTitles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [jobTitleInput, setJobTitleInput] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [jobResults, setJobResults] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate

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
        setUserData((prevData) => ({
          ...prevData,
          user_id: response.data.user_id, // Assuming response.data contains user_id
        }));
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        navigate("/login");
      });
  }, [navigate]);

  const addJobTitle = () => {
    if (jobTitleInput.trim()) {
      setJobTitles([...jobTitles, jobTitleInput.trim()]);
      setJobTitleInput("");
    }
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleDegreeChange = (e) => {
    setUserData({
      ...userData,
      degree: e.target.value,
    });
  };

  const fetchRecommendations = async () => {
    if (!userData.user_id) {
      console.error("User ID is not set.");
      setError("User ID is not set. Please log in.");
      return;
    }

    const updatedUserData = {
      ...userData,
      job_title: jobTitles.join(","),
      skills: skills.join(","),
    };

    // Debug: Log userData before sending
    console.log("Sending userData:", updatedUserData);

    try {
      const response = await axios.post(
        "http://localhost:5005/recommend",
        updatedUserData
      );

      if (response.data.success) {
        const { jobRecommendations } = response.data;
        setJobResults(jobRecommendations);
      } else {
        setError("Recommendation failed");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Job Recommendations</h1>
      <div>
        <h3>Job Titles</h3>
        <input
          type="text"
          value={jobTitleInput}
          onChange={(e) => setJobTitleInput(e.target.value)}
          placeholder="Enter a job title"
        />
        <button onClick={addJobTitle}>+</button>
        <ul>
          {jobTitles.map((title, index) => (
            <li key={index}>{title}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Skills</h3>
        <input
          type="text"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          placeholder="Enter a skill"
        />
        <button onClick={addSkill}>+</button>
        <ul>
          {skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Degree</h3>
        <select value={userData.degree} onChange={handleDegreeChange}>
          <option value="No degree">No degree</option>
          <option value="MBA">MBA</option>
          <option value="PhD">PhD</option>
          <option value="Masters">Masters</option>
          <option value="Bachelors">Bachelors</option>
        </select>
      </div>

      <button onClick={fetchRecommendations}>Get Recommendations</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {jobResults.length > 0 && (
        <div>
          <h2>Recommended Jobs</h2>
          <ul>
            {jobResults.map((job, index) => (
              <li key={index}>
                <p>
                  <strong>Company Name:</strong> {job.companyName}
                </p>
                <p>
                  <strong>Job Title:</strong> {job.jobTitle}
                </p>
                <p>
                  <strong>Overall Similarity:</strong> {job.similarity}%
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecommendJobs;
