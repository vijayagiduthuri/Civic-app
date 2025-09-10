import express from "express";
import {
  createIssue,
  deleteIssue,
  getAllIssues,
  getIssueById,
  getIssuesByUserId,
} from "../controllers/issuesControllers.js";

const router = express.Router();

router.post("/create", createIssue);

router.get("/", getAllIssues);

router.get("/:id", getIssueById);

router.delete("/:id", deleteIssue);

router.get("/user/:id", getIssuesByUserId);

export default router;
