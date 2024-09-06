import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./Database.js";
import Route from "./Route.js";

// Import models
import Users from "./model/Users.js";
import Companies from "./model/Companies.js";
import JobMatches from "./model/JobMatches.js";
import Jobs from "./model/Jobs.js";
import JobSkills from "./model/JobSkills.js";
import MatchedSkills from "./model/MatchedSkills.js";
import Skills from "./model/Skills.js";
import UserSkills from "./model/UserSkills.js";
import UserTitles from "./model/UserTitles.js";
import SavedJobs from "./model/SavedJobs.js";
import Questions from "./model/Questions.js";
import AnswerKey from "./model/AnswerKey.js";
import PracticeSession from "./model/PracticeSession.js";
import AnswerDetails from "./model/AnswerDetails.js";

dotenv.config();
const app = express();

await db.authenticate();
await Users.sync();
await Skills.sync();
await Companies.sync();
await Jobs.sync();
await JobMatches.sync();
await JobSkills.sync();
await MatchedSkills.sync();
await UserSkills.sync();
await UserTitles.sync();
await SavedJobs.sync();
await Questions.sync();
await AnswerKey.sync();
await PracticeSession.sync();
await AnswerDetails.sync();

const allowedOrigin = "https://pathera.vercel.app";

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors({
  origin: allowedOrigin, 
  credentials: true     
}));

app.use(Route);

app.listen(5005, () => console.log("Server running on port 5005"));
