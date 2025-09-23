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
  updateIssueStatus,
  uploadImage,
  getUserIssues,
  getAllI
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

router.post("/upload-image", uploadImage)

router.post("/get-user-issues", getUserIssues);

router.post("/all-issues", getAllI);
export default router;
