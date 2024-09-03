import axios from "axios";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Fix: Use default import for jwtDecode
import { useNavigate, Link } from "react-router-dom"; // Import Link

const RecommendJobs = () => {
  const [userData, setUserData] = useState({
    user_id: null,
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

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setUserData((prevData) => ({
        ...prevData,
        user_id: decodedToken.id, // Assuming token contains 'id' as user ID
      }));
    } catch (error) {
      console.error("Error decoding token:", error);
      navigate("/login");
    }
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
                <Link to={`/jobs/${job.job_id}`}>
                  <p>
                    <strong>Company Name:</strong> {job.companyName}
                  </p>
                  <p>
                    <strong>Job Title:</strong> {job.jobTitle}
                  </p>
                  <p>
                    <strong>Overall Similarity:</strong> {job.similarity}%
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecommendJobs;
