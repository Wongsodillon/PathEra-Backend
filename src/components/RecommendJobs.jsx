import axios from "axios";
import { useState } from "react";

const RecommendJobs = () => {
  const [userData, setUserData] = useState({
    user_id: 1,
    job_title: "",
    skills: "",
    degree: "Bachelor's Degree",
    years_of_experience: 1,
  });

  const [jobTitles, setJobTitles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [jobTitleInput, setJobTitleInput] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [jobResults, setJobResults] = useState([]);
  const [error, setError] = useState(null);

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

  const fetchRecommendations = async () => {
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
