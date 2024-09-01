import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";

const ShowJobs = ({ userId }) => {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5005/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Error fetching jobs. Please try again later.");
      }
    };

    const fetchSavedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5005/wishlisted-jobs/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const savedJobIds = new Set(response.data.map((job) => job.job.id));
        setSavedJobs(savedJobIds);
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
        setError("Error fetching saved jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
    fetchSavedJobs();
  }, [userId]);

  const handleSaveJob = async (job_id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      await axios.post(
        "http://localhost:5005/save-job",
        {
          job_id,
          user_id: userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSavedJobs((prevState) => new Set(prevState.add(job_id)));
    } catch (error) {
      console.error("Error saving job:", error);
      setError("Error saving job. Please try again later.");
    }
  };

  const handleRemoveJob = async (job_id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      await axios.delete("http://localhost:5005/remove-job", {
        data: { job_id, user_id: userId },
        headers: { Authorization: `Bearer ${token}` },
      });

      setSavedJobs((prevState) => {
        const updated = new Set(prevState);
        updated.delete(job_id);
        return updated;
      });
    } catch (error) {
      console.error("Error removing job:", error);
      setError("Error removing job. Please try again later.");
    }
  };

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Job Listings</h1>
      <table>
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Job Title</th>
            <th>Save/Remove Job</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.companyId.company_name}</td>
              <td>{job.job_title}</td>
              <td>
                <FontAwesomeIcon
                  icon={savedJobs.has(job.id) ? faSolidHeart : faRegularHeart}
                  onClick={() => {
                    if (savedJobs.has(job.id)) {
                      handleRemoveJob(job.id);
                    } else {
                      handleSaveJob(job.id);
                    }
                  }}
                  style={{
                    cursor: "pointer",
                    color: savedJobs.has(job.id) ? "red" : "black",
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowJobs;
