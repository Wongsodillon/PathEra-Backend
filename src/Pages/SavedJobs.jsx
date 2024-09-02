import React, { useState, useEffect } from "react";
import axios from "axios";

const SavedJobs = () => {
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

        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        console.log("Decoded Token:", decodedToken); // Log the entire decoded token

        const userId = decodedToken.id; // Adjust based on the actual key used in your payload
        console.log("User ID:", userId); // Log the extracted user ID

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
            </tr>
          </thead>
          <tbody>
            {savedJobs.map((job) => (
              <tr key={job.job.id}>
                <td>{job.job.companyId.company_name}</td>
                <td>{job.job.job_title}</td>
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
