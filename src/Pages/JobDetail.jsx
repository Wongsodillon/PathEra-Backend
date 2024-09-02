import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5005/jobs/${id}`);
        setJob(response.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setError("Error fetching job details. Please try again later.");
      }
    };

    fetchJobDetail();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!job) return <p>Loading job details...</p>;

  return (
    <div>
      <h1>{job.jobTitle}</h1>
      <p>
        <strong>Company:</strong> {job.companyName}
      </p>
      <p>
        <strong>Location:</strong> {job.location}
      </p>
      <p>
        <strong>Industry:</strong> {job.industry}
      </p>
      <p>
        <strong>Degree Required:</strong> {job.degree}
      </p>
      <p>
        <strong>Minimum Experience:</strong> {job.minExperience} years
      </p>
      <p>
        <strong>Date Posted:</strong>{" "}
        {new Date(job.datePosted).toLocaleDateString()}
      </p>
      <p>
        <strong>Job Description:</strong> {job.jobDescription}
      </p>
      <p>
        <strong>Skills Required:</strong> {job.skillsRequired.join(", ")}
      </p>
    </div>
  );
};

export default JobDetail;
