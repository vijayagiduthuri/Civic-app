import express from "express";
import {
  registerTechnician,
  getAllTechnicians,
  getTechniciansByDepartment,
  getUnassignedTechnicians,
} from "../controllers/technicianControllers.js";

const router = express.Router();

router.post("/register", registerTechnician);

router.get("/", getAllTechnicians);

router.post("/technicians-by-dept", getTechniciansByDepartment);

router.get("/unassigned-technicians", getUnassignedTechnicians);

export default router;
