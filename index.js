import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./Database.js";
import fs from "fs";
import csv from "csv-parser";
import Route from "./Route.js";

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
await db.sync();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(Route);

const readCSVFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};

const seedModel = async (Model, data, options = {}) => {
  try {
    await Model.bulkCreate(data, options);
    console.log(`${Model.name} has been seeded successfully.`);
  } catch (error) {
    console.error(`Error seeding ${Model.name}:`, error);
  }
};

const seedData = async () => {
  try {
    const companiesData = await readCSVFile("./dataset/companies.csv");
    await seedModel(Companies, companiesData, { ignoreDuplicates: true });

    const jobsData = await readCSVFile("./dataset/job_for_migration.csv");
    const jobs = jobsData
      .map((data, index) => {
        if (index < 250) {
          return {
            id: parseInt(data.job_id),
            job_title: data.job_title,
            job_type: data.job_type,
            job_level: data.job_level,
            job_model: data.work_model,
            location: data.location,
            job_industry: null,
            min_experience: parseInt(data.min_experience) || 0,
            degree: data.degree || "Not Specified",
            job_description: data.about,
            job_link: "",
            date_posted: null,
            company_id: parseInt(data.company_id),
          };
        }
      })
      .filter(Boolean); 

    await seedModel(Jobs, jobs);

    const jobSkillsData = await readCSVFile("./dataset/job_skills.csv");
    const jobSkills = jobSkillsData.map((data) => ({
      job_id: parseInt(data.job_id),
      skill_id: parseInt(data.skill_id),
    }));
    await seedModel(JobSkills, jobSkills, { ignoreDuplicates: true });

    const questionsData = await readCSVFile("./dataset/questions.csv");
    const questions = questionsData.map((data) => ({
      question: data.Question,
      job_title: data.JobTitle,
      topic: data.Topic,
    }));
    await seedModel(Questions, questions, { ignoreDuplicates: true });

    const skillsData = await readCSVFile("./dataset/skills.csv");
    const skills = skillsData.map((data) => ({
      skill_name: data.skills,
    }));
    await seedModel(Skills, skills, { ignoreDuplicates: true });

    const answerKeyData = await readCSVFile("./dataset/answer_key.csv");
    const answerKey = answerKeyData.map((data) => ({
      question_id: parseInt(data.question_id),
      answer: data.Answer,
    }));
    await seedModel(AnswerKey, answerKey, { ignoreDuplicates: true });

    console.log("All seeding processes completed successfully.");
  } catch (error) {
    console.error("Error during data seeding:", error);
  }
};

const init = async () => {
  await seedData();

  app.listen(5005, () => {
    console.log("Server running on port 5005");
  });
};

init();

process.on("exit", () => {
  db.close();
});
