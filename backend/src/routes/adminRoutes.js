import {
  adminLogin,
  createAdmin,
  getAdminDepartment,
} from "../controllers/adminControllers.js";
import express from "express";

const router = express.Router();

router.post("/create-admin", createAdmin);

router.post("/login", adminLogin);

router.post("/get-department", getAdminDepartment);

export default router;
