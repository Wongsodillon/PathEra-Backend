import axios from "axios";
import MatchedSkills from "../model/MatchedSkills.js";

export const recommendJobs = async (req, res) => {
  try {
    const userData = req.body;

    const response = await axios.post(
      "http://localhost:5020/recommend",
      userData
    );

    if (response.data.success) {
      const { result, skill_matches } = response.data;

      await MatchedSkills.create(skill_matches);

      res.json({ success: true, result });
    } else {
      res.status(500).json({ success: false, error: "Recommendation failed" });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
