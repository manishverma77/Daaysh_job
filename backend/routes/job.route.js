import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
} from "../controllers/job.controller.js";

const router = express.Router();

// Post a new job
router.post("/post", isAuthenticated, postJob);

// Get all jobs
router.get("/get", isAuthenticated, getAllJobs);

// Get admin jobs
router.get("/getadminjobs", isAuthenticated, getAdminJobs);

// Get a specific job by ID
router.get("/get/:id", isAuthenticated, getJobById);

export default router;
