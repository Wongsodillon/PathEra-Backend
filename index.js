import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./Database.js";
import fs from "fs";
import csv from "csv-parser";
import Route from "./Route.js";

import Companies from "./model/Companies.js";
import Jobs from "./model/Jobs.js";

dotenv.config();
const app = express();

await db.authenticate();
await db.sync();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({ credentials: true, origin: "http://pathera.vercel.app" }));
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

// Helper function to remove emojis from text
const removeEmojis = (text) => {
  return text.replace(/[\u{1F600}-\u{1F64F}]/gu, ""); // Adjust regex as needed
};

// Modify job seeding logic
const sanitizeJobData = (data) => {
  try {
    const job = {
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
    };

    return job;
  } catch (err) {
    console.error("Error sanitizing job data:", err);
    return null; // Skip invalid records
  }
};

// Seeder function for Companies and Jobs
const seedModel = async (Model, data, options = {}) => {
  try {
    await Model.bulkCreate(data, options);
    console.log(`${Model.name} has been seeded successfully.`);
  } catch (error) {
    console.error(`Error seeding ${Model.name}:`, error);
  }
};

// Main function to seed Companies and Jobs
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

    console.log("Companies and Jobs have been seeded successfully.");
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
