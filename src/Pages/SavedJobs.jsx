import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const SavedJobs = ({ userId }) => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5005/saved-jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSavedJobs(response.data);
      } catch (error) {
        setError("Error fetching saved jobs. Please try again later.");
        console.error(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const handleRemoveJob = async (job_id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.id; // Ensure this matches your backend token structure

      await axios.delete("http://localhost:5005/remove-job", {
        data: { job_id, user_id: userId }, // Ensure user_id is correctly passed
        headers: { Authorization: `Bearer ${token}` },
      });

      setSavedJobs((prevJobs) =>
        prevJobs.filter((job) => job.job.id !== job_id)
      );
    } catch (error) {
      console.error("Error removing job:", error);
      setError("Error removing job. Please try again later.");
    }
  };

  if (loading) return <p>Loading saved jobs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Saved Jobs</h1>
      {savedJobs.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Job Title</th>
              <th>Remove from Saved</th>
            </tr>
          </thead>
          <tbody>
            {savedJobs.map((job) => (
              <tr key={job.job.id}>
                <td>{job.job.companyId.company_name}</td>
                <td>
                  <Link to={`/jobs/${job.job.id}`}>{job.job.job_title}</Link>
                </td>
                <td>
                  <FontAwesomeIcon
                    icon={faSolidHeart}
                    onClick={() => handleRemoveJob(job.job.id)}
                    style={{
                      cursor: "pointer",
                      color: "red",
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No saved jobs found.</p>
      )}
    </div>
  );
};

export default SavedJobs;
