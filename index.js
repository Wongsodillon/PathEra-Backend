import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./Database.js";
import Route from "./Route.js";

// import Users from "./model/Users.js";
// import Companies from "./model/Companies.js";
// import JobMatches from "./model/JobMatches.js";
// import Jobs from "./model/Jobs.js";
// import JobSkills from "./model/JobSkills.js";
// import MatchedSkills from "./model/MatchedSkills.js";
// import Skills from "./model/Skills.js";
// import UsersExperience from "./model/UsersExperience.js";
// import UserSkills from "./model/UserSkills.js";
// import UserTitles from "./model/UserTitles.js";
// import SavedJobs from "./model/SavedJobs.js";

dotenv.config();
const app = express();

// await db.authenticate();
// await Users.sync();
// await Companies.sync();
// await JobMatches.sync();
// await Jobs.sync();
// await JobSkills.sync();
// await MatchedSkills.sync();
// await Skills.sync();
// await UsersExperience.sync();
// await UserSkills.sync();
// await UserTitles.sync();
// await SavedJobs.sync();

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(Route);

app.listen(5005, () => console.log("Server running on port 5005"));
