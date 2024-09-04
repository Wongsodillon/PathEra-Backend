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

export const showJobDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Jobs.findOne({
      where: { id },
      attributes: [
        "job_title",
        "location",
        "job_industry",
        "degree",
        "min_experience",
        "date_posted",
        "job_description",
      ],
      include: [
        {
          model: Companies,
          as: "companyId",
          attributes: ["company_name"],
        },
        {
          model: JobSkills,
          as: "jobSkills",
          include: [
            {
              model: Skills,
              as: "skill",
              attributes: ["skill_name"],
            },
          ],
        },
      ],
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const jobDetails = {
      jobTitle: job.job_title,
      companyName: job.companyId.company_name,
      location: job.location,
      industry: job.job_industry,
      degree: job.degree,
      minExperience: job.min_experience,
      datePosted: job.date_posted,
      skillsRequired: job.jobSkills.map(
        (jobSkill) => jobSkill.skill?.skill_name || "Unknown"
      ),
      jobDescription: job.job_description,
    };

    res.status(200).json(jobDetails);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving job details" });
  }
};
