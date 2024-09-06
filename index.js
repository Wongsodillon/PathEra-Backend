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


const answer_key = [];

fs.createReadStream("../dataset/answer_key.csv")
  .pipe(csv())
  .on("data", (data) => {
    answer_key.push({
      question_id: data.question_id,
      answer: data.Answer,
    });
  })
  .on("end", async () => {
    try {
      await db.sync();

      const inserted = await AnswerKey.bulkCreate(answer_key, {
        ignoreDuplicates: true,
      });

      console.log(
        `answer_key data has been successfully seeded with ${inserted.length} entries.`
      );
    } catch (error) {
      console.error("Error seeding job_skills data:", error);
    }
  });

const readCSVFile = async (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        if (data.id) {
          data.id = parseInt(data.id);
          data.company_image = data.company_image || null;
          results.push(data);
        } else {
          console.log("Skipping row due to missing id:", data);
        }
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (err) => reject(err));
  });
};

const seedData = async () => {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");

    const companies = await readCSVFile("../dataset/companies.csv");
    await Companies.bulkCreate(companies, {
      validate: true,
      ignoreDuplicates: true,
    });
    console.log("Data has been inserted successfully.");
  } catch (error) {
    console.error("Error during data seeding:", error);
  }
};

seedData();

const results = [];

fs.createReadStream("../dataset/job_for_migration.csv")
  .pipe(csv())
  .on("data", (data) => {
    if (results.length < 250) {
      results.push({
        id: data.job_id,
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
      });
    }
  })
  .on("end", async () => {
    try {
      await db.sync();

      const inserted = await Jobs.bulkCreate(results);

      console.log(
        `Data has been successfully seeded with ${inserted.length} entries.`
      );
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  })
  .on("error", (error) => {
    console.error("Error processing the CSV file:", error);
  });

process.on("exit", () => {
  db.close();
});

const job_skills = [];

fs.createReadStream("../dataset/job_skills.csv")
  .pipe(csv())
  .on("data", (data) => {
    job_skills.push({
      job_id: parseInt(data.job_id),
      skill_id: parseInt(data.skill_id),
    });
  })
  .on("end", async () => {
    try {
      await db.sync();

      const inserted = await JobSkills.bulkCreate(job_skills, {
        ignoreDuplicates: true,
      });

      console.log(
        `JobSkills data has been successfully seeded with ${inserted.length} entries.`
      );
    } catch (error) {
      console.error("Error seeding job_skills data:", error);
    }
  });


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(Route);

app.listen(5005, () => console.log("Server running on port 5005"));
