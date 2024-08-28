import SavedJobs from "../model/SavedJobs.js";
import Jobs from "../model/Jobs.js";
import Companies from "../model/Companies.js";

export const saveJob = async (req, res) => {
  try {
    const { job_id, user_id } = req.body;

    if (!job_id || !user_id) {
      return res.status(400).json({ error: "job_id and user_id are required" });
    }

    const existingSave = await SavedJobs.findOne({
      where: { job_id, user_id },
    });

    if (existingSave) {
      return res
        .status(400)
        .json({ error: "Job is already saved by this user." });
    }

    const savedJob = await SavedJobs.create({ job_id, user_id });

    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const showSavedJobs = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from req.user

    if (!userId) {
      return res.status(400).json({ error: "Invalid or missing user ID" });
    }

    const savedJobs = await SavedJobs.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Jobs,
          as: "job",
          attributes: ["id", "job_title", "job_description", "date_posted"],
          include: [
            {
              model: Companies,
              as: "companyId",
              attributes: ["id", "company_name"],
            },
          ],
        },
      ],
    });

    if (savedJobs.length === 0) {
      return res.status(404).json({ message: "No saved jobs found." });
    }

    return res.status(200).json(savedJobs);
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const showWishlistedJobs = async (req, res) => {
  const { userId } = req.params; // Extract userId from the request parameters

  try {
    // Fetch saved jobs for the user
    const savedJobs = await SavedJobs.findAll({
      where: { user_id: userId }, // Find saved jobs for the given user ID
      include: [
        {
          model: Jobs,
          as: "job",
          attributes: ["id", "job_title", "job_description", "date_posted"],
          include: [
            {
              model: Companies,
              as: "companyId",
              attributes: ["id", "company_name"],
            },
          ],
        },
      ],
    });

    // Check if there are no saved jobs
    if (savedJobs.length === 0) {
      return res
        .status(404)
        .json({ message: "No saved jobs found for this user." });
    }

    // Respond with the list of saved jobs
    return res.status(200).json(savedJobs);
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// controller/SavedJobsController.js

export const removeSavedJob = async (req, res) => {
  const { job_id, user_id } = req.body; // Extract job_id and user_id from the request body

  try {
    // Find and delete the saved job for the user
    const result = await SavedJobs.destroy({
      where: { job_id, user_id },
    });

    // Check if the job was successfully removed
    if (result === 0) {
      return res
        .status(404)
        .json({ message: "Job not found or not saved by this user." });
    }

    // Respond with success message
    return res.status(200).json({ message: "Job removed from saved list." });
  } catch (error) {
    console.error("Error removing job:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
