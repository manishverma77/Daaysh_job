import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
} from "../controllers/application.controller.js";

const router = express.Router();

// Applying for a job by job ID (POST)
router.post("/apply/:id", isAuthenticated, applyJob);

// Get all applied jobs for authenticated user
router.get("/get", isAuthenticated, getAppliedJobs);

// Get applicants for a specific job application by ID
router.get("/:id/applicants", isAuthenticated, getApplicants);

// Update application status by application ID
router.post("/status/:id/update", isAuthenticated, updateStatus);

export default router;
