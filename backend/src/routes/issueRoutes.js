import express from "express";
import {
  createIssue,
  deleteIssue,
  getAllIssues,
  getIssueById,
  getIssuesByUserId,
  getPendingIssuesByDepartment,
  getActiveIssueCoordinatesByDepartment,
  getNearbyIssuesByIdAndDept,
  updateIssueStatus,getIssuesByAdminEmail
} from "../controllers/issuesControllers.js";

const router = express.Router();

router.post("/create", createIssue);

router.get("/", getAllIssues);

router.get("/:id", getIssueById);

router.delete("/:id", deleteIssue);

router.get("/user/:id", getIssuesByUserId);

router.post("/pending-by-department", getPendingIssuesByDepartment);

router.post("/active-coordinates", getActiveIssueCoordinatesByDepartment);

router.post("/nearbyIssue-by-department", getNearbyIssuesByIdAndDept);

router.post("/status",updateIssueStatus)

router.post('/issues-by-department', getIssuesByAdminEmail)

export default router;
