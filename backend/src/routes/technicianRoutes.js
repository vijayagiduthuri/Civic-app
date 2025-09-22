import express from "express";
import {
  registerTechnician,
  getAllTechnicians,
  getTechniciansByDepartment,
  getUnassignedTechnicians,
  getResolvedIssuesByTechnician,
  technicianTriggerHandler,
  getUnassignedTechniciansByAdmin,
  getAllTechniciansByAdminDepartment,
} from "../controllers/technicianControllers.js";

const router = express.Router();

router.post("/register", registerTechnician);

router.get("/", getAllTechnicians);

router.post("/technicians-by-dept", getTechniciansByDepartment);

router.get("/unassigned-technicians", getUnassignedTechnicians);

router.get("/issues-solved-technician", getResolvedIssuesByTechnician);

router.post("/api/technician-trigger", technicianTriggerHandler);

router.post(
  "/unassigned-technicians-by-department",
  getUnassignedTechniciansByAdmin
);

router.post(
  "/all-technicians-by-department",
  getAllTechniciansByAdminDepartment
);

export default router;
