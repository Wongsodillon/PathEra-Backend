import axios from "axios";
import MatchedSkills from "../model/MatchedSkills.js";
import Jobs from "../model/Jobs.js";
import Companies from "../model/Companies.js";

export const recommendJobs = async (req, res) => {
  try {
    // Step 1: Receive user data from the frontend
    const userData = req.body;

    // Step 2: Send the user data to the AI service
    const aiResponse = await axios.post(
      "http://localhost:5020/recommend",
      userData
    );

    // Step 3: Handle AI service response
    if (aiResponse.data.success) {
      const jobRecommendations = aiResponse.data.result;

      // Collect job_ids from the AI response
      const jobIds = jobRecommendations.map((job) => job.job_id);

      // Step 4: Fetch job details from the database
      const jobs = await Jobs.findAll({
        where: { id: jobIds }, // Using 'id' as the primary key for Jobs
        include: {
          model: Companies,
          as: "companyId",
          attributes: ["company_name"],
        },
      });

      // Step 5: Map the results to include job_title and company_name
      const jobDetails = jobs.reduce((acc, job) => {
        acc[job.id] = {
          jobTitle: job.job_title,
          companyName: job.companyId.company_name,
        };
        return acc;
      }, {});

      const enrichedRecommendations = jobRecommendations.map((job) => ({
        companyName: jobDetails[job.job_id]?.companyName || "Unknown",
        jobTitle: jobDetails[job.job_id]?.jobTitle || "Unknown",
        similarity: job.similarity || 0,
      }));

      // Step 6: Return the recommendations to the frontend
      res
        .status(200)
        .json({ success: true, jobRecommendations: enrichedRecommendations });
    } else {
      res.status(500).json({
        success: false,
        error: "AI service failed to provide recommendations",
      });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const showAllJobs = async (req, res) => {
  try {
    const jobs = await Jobs.findAll({
      include: [
        {
          model: Companies,
          as: "companyId",
          attributes: ["id", "company_name", "company_image"],
        },
      ],
      attributes: {
        exclude: [
          "company_id",
          "min_experience",
          "degree",
          "job_link",
          "date_posted",
          "updatedAt",
        ],
      },
    });

    return res.status(200).json(jobs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
