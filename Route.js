import express from "express";
import UserController from "./controller/UserController.js";
import checkToken from "./middleware/CheckToken.js";
import { recommendJobs, showAllJobs } from "./controller/JobController.js";
import { saveJob, showSavedJobs } from "./controller/SavedJobsController.js";
import authenticateToken from "./middleware/AuthToken.js";

const router = express.Router();

router.get("/auth", UserController.auth);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/logout", checkToken, UserController.logout);
router.put("/update-profile", authenticateToken, UserController.updateProfile);
router.post("/recommend", recommendJobs);
router.get("/jobs", showAllJobs);
router.post("/save-job", saveJob);
router.get("/saved-jobs/:user_id", showSavedJobs);

export default router;
