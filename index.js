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
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(Route);

// Helper function to read CSV files
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

const removeEmojis = (text) => {
  return text.replace(/[\u{1F600}-\u{1F64F}]/gu, ""); // Adjust regex as needed
};

// Modify job seeding logic
const sanitizeJobData = (data) => {
  try {
    const job = {
      id: parseInt(data.job_id),
      job_title: data.job_title || "Unknown Job Title",
      job_type: data.job_type || "Unknown",
      job_level: data.job_level || "Unknown",
      job_model: data.work_model || "Unknown",
      location: data.location || "Unknown",
      job_industry: null,
      min_experience: parseInt(data.min_experience) || 0,
      degree: data.degree || "Not Specified",
      job_description: removeEmojis(data.about?.slice(0, 5000)) || "No description available",  // Remove emojis
      job_link: data.job_link || "",
      date_posted: null,
      company_id: parseInt(data.company_id),
    };

    return job;
  } catch (err) {
    console.error("Error sanitizing job data:", err);
    return null; // Skip invalid records
  }
};

// Seeder function for all models
const seedModel = async (Model, data, options = {}) => {
  try {
    await Model.bulkCreate(data, options);
    console.log(`${Model.name} has been seeded successfully.`);
  } catch (error) {
    console.error(`Error seeding ${Model.name}:`, error);
  }
};

// Main function to seed all data
const seedData = async () => {
  try {
    // Seed Companies
    const companiesData = await readCSVFile("./dataset/companies.csv");
    await seedModel(Companies, companiesData, { ignoreDuplicates: true });

    // Seed Jobs
    const jobsData = await readCSVFile("./dataset/job_for_migration.csv");
    const jobs = jobsData
      .map((data, index) => {
        if (index < 250) {
          const sanitizedJob = sanitizeJobData(data);
          return sanitizedJob;
        }
      })
      .filter(Boolean); // Filter out invalid records
    await seedModel(Jobs, jobs);

    // Seed JobSkills
    const jobSkillsData = await readCSVFile("./dataset/job_skills.csv");
    const jobSkills = jobSkillsData.map((data) => ({
      job_id: parseInt(data.job_id),
      skill_id: parseInt(data.skill_id),
    }));
    await seedModel(JobSkills, jobSkills, { ignoreDuplicates: true });

    // Seed Questions
    const questionsData = await readCSVFile("./dataset/questions.csv");
    const questions = questionsData.map((data) => ({
      question: data.Question,
      job_title: data.JobTitle,
      topic: data.Topic,
    }));
    await seedModel(Questions, questions, { ignoreDuplicates: true });

    // Seed Skills
    const skillsData = await readCSVFile("./dataset/skills.csv");
    const skills = skillsData.map((data) => ({
      skill_name: data.skills,
    }));
    await seedModel(Skills, skills, { ignoreDuplicates: true });

    // Seed AnswerKey
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

// Initialize and seed data, then start the server
const init = async () => {
  await seedData();

  app.listen(5005, () => {
    console.log("Server running on port 5005");
  });
};

init();

// Ensure the database connection is closed on exit
process.on("exit", () => {
  db.close();
});
