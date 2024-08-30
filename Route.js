// routes.js
import express from "express";
import UserController from "./controller/UserController.js";
import checkToken from "./middleware/CheckToken.js";
import { recommendJobs, showAllJobs } from "./controller/JobController.js";
import {
  saveJob,
  showSavedJobs,
  showWishlistedJobs,
  removeSavedJob,
} from "./controller/SavedJobsController.js";
import { showSkills } from "./controller/SkillsController.js";
import authenticateToken from "./middleware/AuthToken.js";
import { getQuestions } from "./controller/QuestionsController.js";

const router = express.Router();

router.get("/auth", UserController.auth);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/logout", checkToken, UserController.logout);
router.put("/update-profile", authenticateToken, UserController.updateProfile);
router.post("/recommend", recommendJobs);
router.get("/jobs", showAllJobs);
router.post("/save-job", saveJob);
router.get("/skills", showSkills);
router.get("/questions/:jobTitle", getQuestions);
router.get("/saved-jobs", authenticateToken, showSavedJobs);
router.get("/wishlisted-jobs/:userId", authenticateToken, showWishlistedJobs);
router.delete("/remove-job", authenticateToken, removeSavedJob);

export default router;
