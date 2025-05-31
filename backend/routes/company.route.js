import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  getCompany,
  getCompanyById,
  registerCompany,
  updateCompany,
} from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", isAuthenticated, singleUpload, registerCompany);
router.get("/get", isAuthenticated, getCompany);
router.get("/get/:companyId", isAuthenticated, getCompanyById);
router.put("/update/:companyId", isAuthenticated, singleUpload, updateCompany);

export default router;
