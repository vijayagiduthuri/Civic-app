import express from "express";
import {
  registerTechnician,
  getAllTechnicians,
  getTechniciansByDepartment,
  getUnassignedTechnicians,
  getResolvedIssuesByTechnician,
  technicianTriggerHandler,getUnassignedTechniciansByAdmin
} from "../controllers/technicianControllers.js";

const router = express.Router();

router.post("/register", registerTechnician);

router.get("/", getAllTechnicians);

router.post("/technicians-by-dept", getTechniciansByDepartment);

router.get("/unassigned-technicians", getUnassignedTechnicians);

router.get("/issues-solved-technician", getResolvedIssuesByTechnician);

router.post("/api/technician-trigger", technicianTriggerHandler);

router.post('/unassigned-technicians-by-department', getUnassignedTechniciansByAdmin);

export default router;
