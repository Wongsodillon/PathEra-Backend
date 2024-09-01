import axios from "axios";
import Jobs from "../model/Jobs.js";
import Companies from "../model/Companies.js";

export const recommendJobs = async (req, res) => {
  try {
    const userData = req.body;
    console.log("Received input from frontend:", userData);

    const aiResponse = await axios.post(
      "http://localhost:5020/recommend",
      userData
    );

    if (aiResponse.data.success) {
      const jobRecommendations = aiResponse.data.result;

      const jobIds = jobRecommendations.map((job) => job.job_id);

      const jobs = await Jobs.findAll({
        where: { id: jobIds },
        include: {
          model: Companies,
          as: "companyId",
          attributes: ["company_name"],
        },
      });

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
    console.error("Error fetching jobs:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
