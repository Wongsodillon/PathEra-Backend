import SavedJobs from "../model/SavedJobs.js";
import Jobs from "../model/Jobs.js";
import Companies from "../model/Companies.js";

export const saveJob = async (req, res) => {
  try {
    const { job_id, user_id } = req.body;

    console.log("Received job_id:", job_id);
    console.log("Received user_id:", user_id);

    if (!job_id || !user_id) {
      return res.status(400).json({ error: "job_id and user_id are required" });
    }

    // Check if the job is already saved by this user
    const existingSave = await SavedJobs.findOne({
      where: { job_id, user_id },
    });

    if (existingSave) {
      return res
        .status(400)
        .json({ error: "Job is already saved by this user." });
    }

    // Save the job
    const savedJob = await SavedJobs.create({ job_id, user_id });

    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const showSavedJobs = async (req, res) => {
  try {
    const { user_id } = req.params;

    const savedJobs = await SavedJobs.findAll({
      where: { user_id },
      include: [
        {
          model: Jobs,
          attributes: ["id", "job_title", "job_description", "date_posted"],
          include: [
            {
              model: Companies,
              attributes: ["id", "company_name", "company_image"],
            },
          ],
        },
      ],
    });

    if (savedJobs.length === 0) {
      return res.status(404).json({ message: "No saved jobs found." });
    }

    res.status(200).json(savedJobs);
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    res.status(500).json({ error: error.message });
  }
};
