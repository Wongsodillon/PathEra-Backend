import PracticeSession from "../models/PracticeSession.js";
import AnswerDetails from "../models/AnswerDetails.js";
import { Sequelize } from "sequelize";

const saveSession = async (req, res) => {
    try {
        const { userId, jobTitle } = req.body;
        const newSession = await PracticeSession.create({ user_id: userId, job_title: jobTitle });

    } catch (error) {
        console.error("Error saving practice session:", error);
        return res.status(500).json({ error: error.message });
    }
}