import express from "express";
import {
  registerValidationRules,
  registerValidate,
} from "./middleware/RegisterValidation.js";
import {
  loginValidationRules,
  loginValidate,
} from "./middleware/LoginValidation.js";
import UserController from "./controller/UserController.js";
import checkToken from "./middleware/CheckToken.js";
import { recommendJobs } from "./controller/JobController.js";

const router = express.Router();

router.get("/auth", UserController.auth);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/logout", checkToken, UserController.logout);
router.post("/recommend", recommendJobs);

export default router;
